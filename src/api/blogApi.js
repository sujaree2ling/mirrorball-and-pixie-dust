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

export async function getPostComments(postId) {
  const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`)
  return response.data.comments ?? []
}

export async function createPostComment(postId, content) {
  const response = await axios.post(`${BASE_URL}/posts/${postId}/comments`, {
    content,
  })
  return response.data.comment
}

export async function getPostLikeStatus(postId) {
  const response = await axios.get(`${BASE_URL}/posts/${postId}/like`)
  return response.data
}

export async function togglePostLike(postId) {
  const response = await axios.post(`${BASE_URL}/posts/${postId}/like`)
  return response.data
}

function toFormData(payload, imageFile) {
  const formData = new FormData()

  formData.append('title', payload.title ?? '')
  formData.append('description', payload.description ?? '')
  formData.append('content', payload.content ?? '')
  formData.append('category', payload.category ?? '')
  formData.append('status', payload.status ?? 'published')
  formData.append(
    'image_position',
    payload.imagePosition ?? payload.image_position ?? 'center',
  )

  if (payload.author) formData.append('author', payload.author)
  if (payload.likes !== undefined && payload.likes !== null) {
    formData.append('likes', String(payload.likes))
  }
  if (payload.date) formData.append('date', payload.date)

  if (imageFile) {
    formData.append('imageFile', imageFile)
  } else if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export async function createPost(payload, imageFile) {
  const response = await axios.post(
    `${BASE_URL}/posts`,
    toFormData(payload, imageFile),
  )
  return response.data.post
}

export async function updatePost(id, payload, imageFile) {
  const response = await axios.put(
    `${BASE_URL}/posts/${id}`,
    toFormData(payload, imageFile),
  )
  return response.data.post
}

export async function deletePost(id) {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`)
  return response.data
}
