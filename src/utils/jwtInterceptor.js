import axios from 'axios'
import { toast } from 'sonner'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'current_user'

const AUTH_PUBLIC_PATHS = ['/auth/login', '/auth/register']

function isAuthPublicRequest(url = '') {
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path))
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token && !isAuthPublicRequest(req.url)) {
      req.headers.Authorization = `Bearer ${token}`
    }

    return req
  })

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const requestUrl = error.config?.url || ''

      if (
        status === 401 &&
        !isAuthPublicRequest(requestUrl) &&
        !window.location.pathname.startsWith('/login')
      ) {
        clearAuthStorage()
        window.location.href = '/login'
      }

      if (status === 403) {
        const message =
          error.response?.data?.error ||
          'Admin only. You do not have permission to do this.'

        if (!window.__adminOnlyToastShown) {
          window.__adminOnlyToastShown = true
          toast.error('Admin only', { description: message })
          setTimeout(() => {
            window.__adminOnlyToastShown = false
          }, 2000)
        }
      }

      return Promise.reject(error)
    },
  )
}
