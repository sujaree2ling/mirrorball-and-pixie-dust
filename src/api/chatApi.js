import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getErrorMessage(error, fallback = 'Something went wrong') {
  return error.response?.data?.error || error.message || fallback
}

export async function sendChatMessage({ message, history = [] }) {
  try {
    const response = await axios.post(`${BASE_URL}/chat`, {
      message,
      history,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to send chat message'))
  }
}
