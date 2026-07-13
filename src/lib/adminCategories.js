const CATEGORIES_KEY = 'admin_categories'
const CATEGORY_RENAMES_KEY = 'admin_category_renames'
const LOCAL_ARTICLES_KEY = 'admin_local_articles'
const OVERRIDES_KEY = 'admin_article_overrides'

const DEFAULT_CATEGORIES = [
  { id: 'default-cat', name: 'Cat' },
  { id: 'default-general', name: 'General' },
  { id: 'default-inspiration', name: 'Inspiration' },
]

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

function seedCategoriesIfNeeded() {
  const stored = readJson(CATEGORIES_KEY, null)

  if (!stored) {
    writeJson(CATEGORIES_KEY, DEFAULT_CATEGORIES)
    return DEFAULT_CATEGORIES
  }

  return stored
}

export function getCategories() {
  return seedCategoriesIfNeeded()
}

export function getCategoryNames() {
  return getCategories().map((category) => category.name)
}

export function resolveCategoryName(name) {
  const renames = readJson(CATEGORY_RENAMES_KEY, {})
  let resolved = name
  const visited = new Set()

  while (renames[resolved] && !visited.has(resolved)) {
    visited.add(resolved)
    resolved = renames[resolved]
  }

  return resolved
}

export function getSourceCategoryNames(displayName) {
  const names = new Set([displayName])
  const renames = readJson(CATEGORY_RENAMES_KEY, {})

  Object.keys(renames).forEach((oldName) => {
    if (resolveCategoryName(oldName) === displayName) {
      names.add(oldName)
    }
  })

  return [...names]
}

function syncRenamedCategory(oldName, newName) {
  const renames = readJson(CATEGORY_RENAMES_KEY, {})
  renames[oldName] = newName
  writeJson(CATEGORY_RENAMES_KEY, renames)

  const localArticles = readJson(LOCAL_ARTICLES_KEY, [])
  writeJson(
    LOCAL_ARTICLES_KEY,
    localArticles.map((article) =>
      article.category === oldName ? { ...article, category: newName } : article,
    ),
  )

  const overrides = readJson(OVERRIDES_KEY, {})
  let hasChanges = false

  Object.keys(overrides).forEach((id) => {
    if (overrides[id].category === oldName) {
      overrides[id] = { ...overrides[id], category: newName }
      hasChanges = true
    }
  })

  if (hasChanges) {
    writeJson(OVERRIDES_KEY, overrides)
  }
}

export function getCategory(id) {
  return getCategories().find((category) => String(category.id) === String(id)) ?? null
}

export function fetchCategories({ keyword = '' } = {}) {
  let categories = getCategories()

  if (keyword.trim()) {
    const query = keyword.trim().toLowerCase()
    categories = categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    )
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name))
}

export function createCategory(name) {
  const trimmedName = name.trim()
  const categories = getCategories()

  if (categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase())) {
    throw new Error('Category name already exists')
  }

  const category = {
    id: `local-${Date.now()}`,
    name: trimmedName,
  }

  writeJson(CATEGORIES_KEY, [category, ...categories])
  return category
}

export function updateCategory(id, name) {
  const trimmedName = name.trim()
  const categories = getCategories()
  const index = categories.findIndex((category) => String(category.id) === String(id))

  if (index === -1) {
    throw new Error('Category not found')
  }

  if (
    categories.some(
      (category, categoryIndex) =>
        categoryIndex !== index &&
        category.name.toLowerCase() === trimmedName.toLowerCase(),
    )
  ) {
    throw new Error('Category name already exists')
  }

  const oldName = categories[index].name
  const updated = { ...categories[index], name: trimmedName }
  categories[index] = updated
  writeJson(CATEGORIES_KEY, categories)

  if (oldName !== trimmedName) {
    syncRenamedCategory(oldName, trimmedName)
  }

  return updated
}

export function deleteCategory(id) {
  const categories = getCategories().filter(
    (category) => String(category.id) !== String(id),
  )

  writeJson(CATEGORIES_KEY, categories)
}
