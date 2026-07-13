const TOKEN_KEY = 'access_token'
const USERS_KEY = 'registered_users'
const USER_KEY = 'current_user'
const DEFAULT_AVATAR = '/author-icon.jpg'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function saveCurrentUser(user) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ ...user, avatar: user.avatar || DEFAULT_AVATAR }),
  )
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

export function registerUser({ name, username, email, password }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Email is already taken')
  }

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
    throw new Error('Username is already taken')
  }

  users.push({
    name: name.trim(),
    username: username.trim(),
    email: normalizedEmail,
    password,
  })

  saveUsers(users)
}

export function loginUser({ email, password }) {
  const user = getUsers().find(
    (item) => item.email === email.trim().toLowerCase(),
  )

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials')
  }

  return {
    access_token: `local-${user.email}`,
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || DEFAULT_AVATAR,
      bio: user.bio ?? '',
    },
  }
}

export function updateUserProfile({ name, username, avatar, bio }) {
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Not logged in')

  const users = getUsers()
  const userIndex = users.findIndex((user) => user.email === currentUser.email)
  if (userIndex === -1) throw new Error('User not found')

  const normalizedUsername = username.trim().toLowerCase()
  const usernameTaken = users.some(
    (user, index) =>
      index !== userIndex && user.username.toLowerCase() === normalizedUsername,
  )

  if (usernameTaken) {
    throw new Error('Username is already taken')
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name.trim(),
    username: username.trim(),
    avatar: avatar || users[userIndex].avatar || DEFAULT_AVATAR,
    bio: bio ?? users[userIndex].bio ?? '',
  }

  saveUsers(users)
  saveCurrentUser({
    name: users[userIndex].name,
    username: users[userIndex].username,
    email: users[userIndex].email,
    avatar: users[userIndex].avatar,
    bio: users[userIndex].bio,
  })

  return getCurrentUser()
}

export function resetUserPassword({ currentPassword, newPassword }) {
  const currentUser = getCurrentUser()
  if (!currentUser) throw new Error('Not logged in')

  const users = getUsers()
  const userIndex = users.findIndex((user) => user.email === currentUser.email)
  if (userIndex === -1) throw new Error('User not found')

  if (users[userIndex].password !== currentPassword) {
    throw new Error('Current password is incorrect')
  }

  users[userIndex].password = newPassword
  saveUsers(users)
}
