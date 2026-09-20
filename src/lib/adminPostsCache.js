import { getPosts } from '@/api/blogApi'

const CACHE_TTL_MS = 30_000

let cachedPosts = null
let cachedAt = 0
let inflight = null

function mergePosts(...lists) {
  const seen = new Set()
  const posts = []

  lists.flat().forEach((post) => {
    if (!post || seen.has(post.id)) return
    seen.add(post.id)
    posts.push(post)
  })

  return posts
}

async function loadPostsFromApi() {
  try {
    const all = await getPosts({ page: 1, limit: 100, status: 'all' })

    // Older API builds treat status=all as a literal value and return 0 rows.
    if (all.totalPosts === 0) {
      const published = await getPosts({ page: 1, limit: 100, status: 'published' })
      if (published.totalPosts > 0) {
        const drafts = await getPosts({ page: 1, limit: 100, status: 'draft' })
        return mergePosts(published.posts, drafts.posts)
      }
    }

    return all.posts ?? []
  } catch {
    const [published, drafts] = await Promise.all([
      getPosts({ page: 1, limit: 100, status: 'published' }),
      getPosts({ page: 1, limit: 100, status: 'draft' }),
    ])
    return mergePosts(published.posts, drafts.posts)
  }
}

export async function fetchAllAdminPosts({ force = false } = {}) {
  if (!force && cachedPosts && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedPosts
  }

  if (!force && inflight) {
    return inflight
  }

  inflight = loadPostsFromApi()
    .then((posts) => {
      cachedPosts = posts
      cachedAt = Date.now()
      return posts
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

export function invalidateAdminPostsCache() {
  cachedPosts = null
  cachedAt = 0
  inflight = null
}
