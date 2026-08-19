const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'auth_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token, remember = true) {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  if (token) {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
  }
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''
    const message =
      data?.message ||
      validationErrors ||
      `So'rovda xatolik yuz berdi (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.errors = data?.errors
    throw error
  }

  return data
}

async function requestForm(path, formData) {
  const token = getToken()
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null
  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''
    const error = new Error(
      data?.message ||
        validationErrors ||
        `So'rovda xatolik yuz berdi (${response.status})`,
    )
    error.status = response.status
    error.errors = data?.errors
    throw error
  }
  return data
}

async function requestBlob(path) {
  const token = getToken()
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: '*/*',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!response.ok) {
    let message = `So'rovda xatolik yuz berdi (${response.status})`
    try {
      const data = await response.json()
      message = data?.message || message
    } catch {
      // The response may be a non-JSON error body.
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return response.blob()
}

const client = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  postForm: requestForm,
  getBlob: requestBlob,
  getToken,
  setToken,
}

export { client as api }
export default client
