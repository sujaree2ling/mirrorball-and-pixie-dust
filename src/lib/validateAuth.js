const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LOGIN_ERROR_TITLE =
  "Your password is incorrect or this email doesn't exist"

export const LOGIN_ERROR_DESCRIPTION = 'Please try another password or email'

export function validateSignUp({ name, username, email, password }) {
  const errors = {}

  if (!name.trim()) errors.name = 'Name is required'
  if (!username.trim()) errors.username = 'Username is required'

  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Invalid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Invalid email address'
  }

  if (!password) errors.password = 'Password is required'

  return errors
}

export function mapRegisterApiError(message) {
  const lower = message.toLowerCase()

  if (lower.includes('email') && (lower.includes('exist') || lower.includes('used') || lower.includes('taken'))) {
    return { email: 'Email is already taken, please try another one.' }
  }

  if (lower.includes('username') && (lower.includes('exist') || lower.includes('used') || lower.includes('taken'))) {
    return { username: 'Username is already taken, please try another username.' }
  }

  return { form: message }
}

export function mapLoginApiError() {
  return { form: LOGIN_ERROR_TITLE }
}
