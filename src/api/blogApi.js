import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getPosts({
  page = 1,
  limit = 6,
  category = '',
  keyword = '',
  status = 'published',
} = {}) {
  const params = { page, limit }

  if (category) params.category = category
  if (keyword) params.keyword = keyword
  if (status) params.status = status

  const response = await axios.get(`${BASE_URL}/posts`, { params })
  return response.data
}

export async function getPost(id) {
  const response = await axios.get(`${BASE_URL}/posts/${id}`)
  return response.data
}
