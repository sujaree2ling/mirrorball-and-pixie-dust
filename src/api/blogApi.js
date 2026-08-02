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

function toApiBody(payload) {
  return {
    title: payload.title,
    description: payload.description,
    content: payload.content,
    category: payload.category,
    image: payload.image,
    status: payload.status,
    image_position: payload.imagePosition ?? payload.image_position ?? 'center',
    author: payload.author,
    likes: payload.likes,
    date: payload.date,
  }
}

export async function createPost(payload) {
  const response = await axios.post(`${BASE_URL}/posts`, toApiBody(payload))
  return response.data.post
}

export async function updatePost(id, payload) {
  const response = await axios.put(`${BASE_URL}/posts/${id}`, toApiBody(payload))
  return response.data.post
}

export async function deletePost(id) {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`)
  return response.data
}
