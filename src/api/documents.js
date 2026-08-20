import { api } from './client'

export function generateDocument(payload) {
  return api.post('/documents/generate', payload)
}

export function getDocuments() {
  return api.get('/documents')
}

export function deleteDocument(id) {
  return api.delete(`/documents/${id}`)
}

export function getDocumentFileUrl(id) {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
  return `${baseUrl}/documents/${id}/file`
}

export async function downloadDocumentFile(id) {
  const token =
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
  const response = await fetch(`${baseUrl}/documents/${id}/file`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    let message = `So'rovda xatolik yuz berdi (${response.status})`
    try {
      const data = await response.json()
      message = data?.message || message
    } catch {
      // non-JSON error body
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return response.blob()
}
