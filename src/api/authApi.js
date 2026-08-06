import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getErrorMessage(error, fallback = 'Something went wrong') {
  return error.response?.data?.error || error.message || fallback
}

export async function register(payload) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to create user. Please try again.'))
  }
}

export async function login({ email, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password })
    return response.data
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Your password is incorrect or this email doesn't exist",
      ),
    )
  }
}

export async function getUser() {
  try {
    const response = await axios.get(`${BASE_URL}/auth/get-user`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unauthorized or token expired'))
  }
}

export async function resetPassword({ oldPassword, newPassword }) {
  try {
    const response = await axios.put(`${BASE_URL}/auth/reset-password`, {
      oldPassword,
      newPassword,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to reset password'))
  }
}
