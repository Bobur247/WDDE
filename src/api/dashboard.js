import { api } from './client'

export function getDashboard() {
  return api.get('/dashboard')
}
