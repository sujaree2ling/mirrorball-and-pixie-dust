import axios from 'axios'

const BASE_URL = 'https://blog-post-project-api.vercel.app'

export async function register({ name, username, email, password }) {
  const response = await axios.post(`${BASE_URL}/register`, {
    name,
    username,
    email,
    password,
  })
  return response.data
}

export async function login({ email, password }) {
  const response = await axios.post(`${BASE_URL}/login`, { email, password })
  return response.data
}

export function getAuthErrorMessage(error) {
  const data = error.response?.data

  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return data.error

  return 'Something went wrong. Please try again.'
}
