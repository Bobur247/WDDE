import { api } from './client'

export function getTemplates(params = {}) {
  const query = new URLSearchParams(params).toString()
  return api.get(`/templates${query ? `?${query}` : ''}`)
}

export function getCategories() {
  return api.get('/template-categories')
}

export function createTemplate(formData) {
  return api.post('/templates', formData)
}

export function deleteTemplate(id) {
  return api.delete(`/templates/${id}`)
}

export function fetchTemplateFileBlob(id) {
  return api.getBlob(`/templates/${id}/file`)
}

export function fetchTemplateImageBlob(id) {
  return api.getBlob(`/templates/${id}/image`)
}

export function getTemplateImageUrl(id) {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
  return `${baseUrl}/templates/${id}/image`
}
