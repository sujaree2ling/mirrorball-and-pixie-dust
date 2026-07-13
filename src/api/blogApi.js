import axios from 'axios'

const BASE_URL = 'https://blog-post-project-api.vercel.app'

export async function getPosts({
  page = 1,
  limit = 6,
  category = '',
  keyword = '',
  status = '',
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
