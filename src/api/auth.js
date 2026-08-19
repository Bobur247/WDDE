import client from './client'

function saveResponseToken(data, remember) {
  const token = data?.token || data?.data?.token
  if (token) client.setToken(token, remember)
}

export function register(name, email, password, passwordConfirmation) {
  return client.post('/auth/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  })
}

export function verifyEmail(email, code) {
  return client.post('/auth/verify-email', { email, code })
}

export function resendVerification(email) {
  return client.post('/auth/resend-verification', { email })
}

export async function login(email, password, remember = true) {
  const data = await client.post('/auth/login', { email, password })
  saveResponseToken(data, remember)
  return data
}

export function getCurrentUser() {
  return client.get('/auth/me')
}

export async function logout() {
  try {
    await client.post('/auth/logout')
  } finally {
    client.setToken(null)
  }
}

export function getMe() {
  return client.get('/auth/me')
}

export function forgotPassword(email) {
  return client.post('/auth/forgot-password', { email })
}

export function verifyResetCode(email, code) {
  return client.post('/auth/verify-reset-code', { email, code })
}

export function resetPassword(email, code, password, passwordConfirmation) {
  return client.post('/auth/reset-password', {
    email,
    code,
    password,
    password_confirmation: passwordConfirmation,
  })
}
