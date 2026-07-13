import { getPost, getPosts } from '@/api/blogApi'
import { getCategoryNames, getSourceCategoryNames, resolveCategoryName } from '@/lib/adminCategories'
import { getCurrentUser } from '@/lib/auth'

const LOCAL_ARTICLES_KEY = 'admin_local_articles'
const OVERRIDES_KEY = 'admin_article_overrides'
const DELETED_API_IDS_KEY = 'admin_deleted_api_ids'

export function getArticleCategories() {
  return getCategoryNames()
}
export const ARTICLE_STATUSES = ['draft', 'published']

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getLocalArticles() {
  return readJson(LOCAL_ARTICLES_KEY, [])
}

function saveLocalArticles(articles) {
  writeJson(LOCAL_ARTICLES_KEY, articles)
}

function getOverrides() {
  return readJson(OVERRIDES_KEY, {})
}

function saveOverrides(overrides) {
  writeJson(OVERRIDES_KEY, overrides)
}

function getDeletedApiIds() {
  return readJson(DELETED_API_IDS_KEY, [])
}

function saveDeletedApiIds(ids) {
  writeJson(DELETED_API_IDS_KEY, ids)
}

function normalizeArticle(article, source) {
  return {
    id: article.id,
    title: article.title ?? '',
    description: article.description ?? '',
    content: article.content ?? '',
    category: resolveCategoryName(article.category ?? 'General'),
    image: article.image ?? '',
    author: article.author ?? getCurrentUser()?.name ?? 'Admin',
    date: article.date ?? new Date().toISOString(),
    status: article.status ?? 'published',
    source,
  }
}

export async function fetchAdminArticles({
  page = 1,
  limit = 10,
  category = '',
  keyword = '',
  status = '',
} = {}) {
  const deletedIds = new Set(getDeletedApiIds())
  const overrides = getOverrides()
  const seenApiIds = new Set()
  const apiPosts = []

  const addApiPosts = (posts) => {
    posts.forEach((post) => {
      if (deletedIds.has(post.id) || seenApiIds.has(post.id)) return
      seenApiIds.add(post.id)
      apiPosts.push(post)
    })
  }

  if (category) {
    const sourceCategories = getSourceCategoryNames(category)

    for (const sourceCategory of sourceCategories) {
      const apiData = await getPosts({
        page: 1,
        limit: 30,
        keyword,
        category: sourceCategory,
      })
      addApiPosts(apiData.posts)
    }

    const overrideIds = Object.entries(overrides)
      .filter(([, value]) => resolveCategoryName(value.category ?? '') === category)
      .map(([id]) => id)

    await Promise.all(
      overrideIds.map(async (postId) => {
        if (seenApiIds.has(Number(postId)) || deletedIds.has(Number(postId))) return

        try {
          const post = await getPost(postId)
          addApiPosts([post])
        } catch {
          // Post may have been removed from API.
        }
      }),
    )
  } else {
    const apiData = await getPosts({ page: 1, limit: 30, keyword })
    addApiPosts(apiData.posts)
  }

  const apiArticles = apiPosts.map((post) => {
    const postOverride = overrides[post.id] ?? overrides[String(post.id)] ?? {}

    return normalizeArticle(
      {
        ...post,
        ...postOverride,
        status: postOverride.status ?? 'published',
      },
      'api',
    )
  })

  const localArticles = getLocalArticles().map((post) =>
    normalizeArticle(post, 'local'),
  )

  let merged = [...apiArticles, ...localArticles]

  if (status) {
    merged = merged.filter((article) => article.status === status)
  }

  if (keyword) {
    const query = keyword.trim().toLowerCase()
    merged = merged.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query),
    )
  }

  if (category) {
    merged = merged.filter((article) => article.category === category)
  }

  merged.sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalPosts = merged.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / limit))
  const start = (page - 1) * limit

  return {
    posts: merged.slice(start, start + limit),
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
  }
}

export async function getAdminArticle(id) {
  const local = getLocalArticles().find((article) => String(article.id) === String(id))
  if (local) return normalizeArticle(local, 'local')

  const deletedIds = getDeletedApiIds()
  if (deletedIds.includes(Number(id))) return null

  const overrides = getOverrides()[id] ?? {}

  try {
    const apiPost = await getPost(id)

    return normalizeArticle(
      {
        ...apiPost,
        ...overrides,
        status: overrides.status ?? 'published',
      },
      'api',
    )
  } catch {
    return null
  }
}

export function createArticle(payload) {
  const article = normalizeArticle(
    {
      ...payload,
      id: `local-${Date.now()}`,
      date: new Date().toISOString(),
      author: getCurrentUser()?.name ?? 'Admin',
    },
    'local',
  )

  saveLocalArticles([article, ...getLocalArticles()])
  return article
}

export function updateArticle(id, payload) {
  const locals = getLocalArticles()
  const localIndex = locals.findIndex((article) => String(article.id) === String(id))

  if (localIndex !== -1) {
    const updated = normalizeArticle({ ...locals[localIndex], ...payload, id }, 'local')
    locals[localIndex] = updated
    saveLocalArticles(locals)
    return updated
  }

  const overrides = getOverrides()
  overrides[id] = {
    ...overrides[id],
    ...payload,
    id: Number(id),
  }
  saveOverrides(overrides)

  return normalizeArticle(
    {
      id: Number(id),
      ...payload,
    },
    'api',
  )
}

export function deleteArticle(id) {
  const locals = getLocalArticles()
  const localIndex = locals.findIndex((article) => String(article.id) === String(id))

  if (localIndex !== -1) {
    saveLocalArticles(locals.filter((article) => String(article.id) !== String(id)))
    return
  }

  const deletedIds = getDeletedApiIds()
  const numericId = Number(id)

  if (!deletedIds.includes(numericId)) {
    saveDeletedApiIds([...deletedIds, numericId])
  }

  const overrides = { ...getOverrides() }
  delete overrides[id]
  saveOverrides(overrides)
}
