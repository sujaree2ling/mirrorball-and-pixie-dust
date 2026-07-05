const TOKEN_KEY = 'access_token'
const USERS_KEY = 'registered_users'

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
    },
  }
}
