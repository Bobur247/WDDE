import { api } from './client'

export function getHistory() {
  return api.get('/history')
}

export function deleteHistoryItem(id) {
  return api.delete(`/history/${id}`)
}
