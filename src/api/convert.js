import { api, getToken, setToken } from './client'

export async function uploadConversionFile(file, direction) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('direction', direction)
  return api.post('/convert/upload', formData)
}

export async function runConversion(fileId, direction, settings) {
  return api.post('/convert/run', {
    file_id: fileId,
    direction,
    settings,
  })
}

export function getDownloadUrl(resultId) {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'
  return `${baseUrl}/convert/files/${resultId}/download`
}

export async function downloadConversionFile(resultId) {
  const response = await fetch(getDownloadUrl(resultId), {
    headers: {
      Accept: '*/*',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  })
  if (response.status === 401) {
    setToken(null)
    window.location.assign('/login')
  }
  if (!response.ok) {
    let message = `Faylni yuklab bo'lmadi (${response.status})`
    try {
      const data = await response.json()
      message = data?.message || message
    } catch {
      // The backend may return a binary error response.
    }
    throw new Error(message)
  }
  return response.blob()
}

export async function convertFile(file, direction, settings) {
  const uploadResponse = await uploadConversionFile(file, direction)
  const fileId = uploadResponse?.data?.file_id || uploadResponse?.data?.id
  if (!fileId) throw new Error('Backend fayl ID qaytarmadi')
  const response = await runConversion(fileId, direction, settings)
  return {
    ...response,
    data: { ...(response?.data || {}), id: response?.data?.id || fileId },
  }
}
