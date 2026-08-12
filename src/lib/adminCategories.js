import { updatePost } from '@/api/blogApi'
import {
  fetchAllAdminPosts,
  invalidateAdminPostsCache,
} from '@/lib/adminPostsCache'

const EXTRAS_KEY = 'admin_category_extras'
const LEGACY_KEYS = [
  'admin_categories',
  'admin_category_renames',
]

const FALLBACK_CATEGORIES = ['Taylor Swift', 'Disney']

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

function clearLegacyCategoryStorage() {
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key))
}

function categoryIdFromName(name) {
  return encodeURIComponent(name)
}

function categoryNameFromId(id) {
  try {
    return decodeURIComponent(String(id))
  } catch {
    return String(id)
  }
}

function getExtras() {
  return readJson(EXTRAS_KEY, []).filter(
    (name) => typeof name === 'string' && name.trim(),
  )
}

function saveExtras(names) {
  writeJson(
    EXTRAS_KEY,
    [...new Set(names.map((name) => name.trim()).filter(Boolean))],
  )
}

function toCategory(name, source) {
  return {
    id: categoryIdFromName(name),
    name,
    source,
  }
}

function buildCategories(posts) {
  clearLegacyCategoryStorage()

  const fromPosts = [
    ...new Set(posts.map((post) => post.category).filter(Boolean)),
  ]

  const extras = getExtras().filter(
    (name) =>
      !fromPosts.some((postName) => postName.toLowerCase() === name.toLowerCase()),
  )

  const fallbacks = FALLBACK_CATEGORIES.filter(
    (name) =>
      !fromPosts.some((postName) => postName.toLowerCase() === name.toLowerCase()) &&
      !extras.some((extra) => extra.toLowerCase() === name.toLowerCase()),
  )

  return [
    ...fromPosts.map((name) => toCategory(name, 'api')),
    ...extras.map((name) => toCategory(name, 'extra')),
    ...fallbacks.map((name) => toCategory(name, 'fallback')),
  ].sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchCategories({ keyword = '' } = {}) {
  const posts = await fetchAllAdminPosts()
  let categories = buildCategories(posts)

  if (keyword.trim()) {
    const query = keyword.trim().toLowerCase()
    categories = categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    )
  }

  return categories
}

export async function getCategoryNames() {
  const categories = await fetchCategories()
  return categories.map((category) => category.name)
}

export function resolveCategoryName(name) {
  return name
}

export function getSourceCategoryNames(displayName) {
  return [displayName]
}

export async function getCategory(id) {
  const name = categoryNameFromId(id)
  const categories = await fetchCategories()
  return (
    categories.find(
      (category) =>
        String(category.id) === String(id) ||
        category.name.toLowerCase() === name.toLowerCase(),
    ) ?? null
  )
}

export async function createCategory(name) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error('Category name is required')
  }

  const existing = await fetchCategories()
  if (
    existing.some(
      (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
    )
  ) {
    throw new Error('Category name already exists')
  }

  saveExtras([trimmedName, ...getExtras()])
  return toCategory(trimmedName, 'extra')
}

export async function updateCategory(id, name) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error('Category name is required')
  }

  const category = await getCategory(id)
  if (!category) {
    throw new Error('Category not found')
  }

  const oldName = category.name
  if (oldName === trimmedName) {
    return toCategory(trimmedName, category.source)
  }

  const existing = await fetchCategories()
  if (
    existing.some(
      (item) =>
        item.name.toLowerCase() === trimmedName.toLowerCase() &&
        item.name.toLowerCase() !== oldName.toLowerCase(),
    )
  ) {
    throw new Error('Category name already exists')
  }

  const posts = await fetchAllAdminPosts()
  const postsToUpdate = posts.filter((post) => post.category === oldName)

  await Promise.all(
    postsToUpdate.map((post) =>
      updatePost(post.id, {
        title: post.title,
        description: post.description,
        content: post.content,
        category: trimmedName,
        image: post.image,
        status: post.status,
        imagePosition: post.imagePosition,
        author: post.author,
        likes: post.likes,
      }),
    ),
  )

  saveExtras(
    getExtras().map((extra) => (extra === oldName ? trimmedName : extra)),
  )
  invalidateAdminPostsCache()

  return toCategory(trimmedName, postsToUpdate.length > 0 ? 'api' : 'extra')
}

export async function deleteCategory(id) {
  const category = await getCategory(id)
  if (!category) {
    throw new Error('Category not found')
  }

  const posts = await fetchAllAdminPosts()
  const postsUsingCategory = posts.filter(
    (post) => post.category === category.name,
  )

  if (postsUsingCategory.length > 0) {
    throw new Error(
      'Cannot delete a category that is still used by articles in Supabase',
    )
  }

  saveExtras(getExtras().filter((name) => name !== category.name))
}
