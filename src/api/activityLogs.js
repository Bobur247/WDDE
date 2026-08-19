import { api } from './client'

export function getActivityLogs(page = 1, perPage = 10) {
  return api.get(`/activity-logs?page=${page}&per_page=${perPage}`)
}

export function getDashboard() {
  return api.get('/dashboard')
}
