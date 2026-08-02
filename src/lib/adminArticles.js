import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from '@/api/blogApi'
import { getCategoryNames, resolveCategoryName } from '@/lib/adminCategories'
import {
  fetchAllAdminPosts,
  invalidateAdminPostsCache,
} from '@/lib/adminPostsCache'
import { getCurrentUser } from '@/lib/auth'

const LEGACY_LOCAL_KEYS = [
  'admin_local_articles',
  'admin_article_overrides',
  'admin_deleted_api_ids',
]

export async function getArticleCategories() {
  return getCategoryNames()
}
export const ARTICLE_STATUSES = ['draft', 'published']
export const ARTICLE_IMAGE_POSITIONS = ['top', 'center', 'bottom']
const DEFAULT_CATEGORY = 'Taylor Swift'

function clearLegacyLocalArticles() {
  LEGACY_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key))
}

function normalizeArticle(article) {
  return {
    id: article.id,
    title: article.title ?? '',
    description: article.description ?? '',
    content: article.content ?? '',
    category: resolveCategoryName(article.category ?? DEFAULT_CATEGORY),
    image: article.image ?? '',
    imagePosition: article.imagePosition ?? article.image_position ?? 'center',
    author: article.author ?? getCurrentUser()?.name ?? 'Admin',
    date: article.date ?? new Date().toISOString(),
    likes: article.likes ?? 0,
    status: article.status ?? 'published',
    source: 'api',
  }
}

export async function fetchAdminArticles({
  page = 1,
  limit = 10,
  category = '',
  keyword = '',
  status = '',
} = {}) {
  clearLegacyLocalArticles()

  let articles = (await fetchAllAdminPosts()).map((post) => normalizeArticle(post))

  if (status) {
    articles = articles.filter((article) => article.status === status)
  }

  if (keyword) {
    const query = keyword.trim().toLowerCase()
    articles = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query),
    )
  }

  if (category) {
    articles = articles.filter((article) => article.category === category)
  }

  articles.sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalPosts = articles.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / limit))
  const start = (page - 1) * limit

  return {
    posts: articles.slice(start, start + limit),
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
  }
}

export async function getAdminArticle(id) {
  clearLegacyLocalArticles()

  if (String(id).startsWith('local-')) return null

  const cached = (await fetchAllAdminPosts()).find(
    (post) => String(post.id) === String(id),
  )
  if (cached) return normalizeArticle(cached)

  try {
    const apiPost = await getPost(id)
    return normalizeArticle(apiPost)
  } catch {
    return null
  }
}

export async function createArticle(payload) {
  const post = await createPost({
    ...payload,
    author: payload.author || getCurrentUser()?.name || 'Admin',
  })
  invalidateAdminPostsCache()
  return normalizeArticle(post)
}

export async function updateArticle(id, payload) {
  const post = await updatePost(id, {
    ...payload,
    author: payload.author || getCurrentUser()?.name || 'Admin',
  })
  invalidateAdminPostsCache()
  return normalizeArticle(post)
}

export async function deleteArticle(id) {
  if (String(id).startsWith('local-')) return
  await deletePost(id)
  invalidateAdminPostsCache()
}
