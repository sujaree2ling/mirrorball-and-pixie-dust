import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getNotifications() {
  const response = await axios.get(`${BASE_URL}/notifications`)
  return response.data.notifications ?? []
}
