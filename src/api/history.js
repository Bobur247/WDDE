import { api } from './client'

export function uploadHistoryFile(
  file,
  fileName,
  { blocksCount = 0, result = '' } = {},
) {
  const formData = new FormData()
  const format = fileName.split('.').pop().toLowerCase()
  formData.append('file', file)
  formData.append('file_name', fileName)
  formData.append('type', 'extraction')
  formData.append(
    'format',
    ['docx', 'txt', 'csv', 'json', 'pdf'].includes(format) ? format : 'txt',
  )
  formData.append('blocks_count', String(blocksCount))
  formData.append('result', result)
  formData.append('status', 'success')
  return api.postForm('/history', formData)
}

export function getHistory(page = 1, perPage = 20) {
  return api.get(`/history?page=${page}&per_page=${perPage}`)
}

export function deleteHistoryItem(id) {
  return api.delete(`/history/${id}`)
}

export function downloadHistoryFile(id) {
  return api.getBlob(`/history/${id}/download`)
}
