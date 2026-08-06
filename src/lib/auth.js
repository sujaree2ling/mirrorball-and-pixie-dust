import {
  getUser as fetchUserFromApi,
  login as loginWithApi,
  register as registerWithApi,
  resetPassword as resetPasswordWithApi,
} from '@/api/authApi'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'current_user'
const DEFAULT_AVATAR = '/author-icon.jpg'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role ?? 'user',
    avatar: user.avatar || user.profilePic || DEFAULT_AVATAR,
    profilePic: user.profilePic ?? null,
    bio: user.bio ?? '',
  }
}

export function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)))
}

export function getCurrentUser() {
  if (!getToken()) return null

  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function logoutUser() {
  clearToken()
  localStorage.removeItem(USER_KEY)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export async function registerUser({ name, username, email, password }) {
  await registerWithApi({
    name: name.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
  })
}

export async function loginUser({ email, password }) {
  const loginData = await loginWithApi({
    email: email.trim().toLowerCase(),
    password,
  })

  const token = loginData.access_token
  saveToken(token)

  const apiUser = await fetchUserFromApi()
  const user = normalizeUser(apiUser)
  saveCurrentUser(user)

  return {
    access_token: token,
    user,
  }
}

export async function refreshCurrentUser() {
  const token = getToken()
  if (!token) return null

  try {
    const apiUser = await fetchUserFromApi()
    const user = normalizeUser(apiUser)
    saveCurrentUser(user)
    return user
  } catch {
    logoutUser()
    return null
  }
}

export function updateUserProfile({ name, username, avatar, bio }) {
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Not logged in')

  const updatedUser = normalizeUser({
    ...currentUser,
    name: name.trim(),
    username: username.trim(),
    avatar: avatar || currentUser.avatar || DEFAULT_AVATAR,
    bio: bio ?? currentUser.bio ?? '',
  })

  saveCurrentUser(updatedUser)
  return updatedUser
}

export async function resetUserPassword({ currentPassword, newPassword }) {
  if (!getToken()) throw new Error('Not logged in')

  try {
    await resetPasswordWithApi({
      oldPassword: currentPassword,
      newPassword,
    })
  } catch (error) {
    if (
      error.message.toLowerCase().includes('invalid old password') ||
      error.message.toLowerCase().includes('old password')
    ) {
      throw new Error('Current password is incorrect')
    }
    throw error
  }
}
