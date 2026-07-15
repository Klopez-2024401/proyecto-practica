import axios from 'axios'
import { getToken, clearSession } from '../utils/authSession.js'

export const tasksApi = axios.create({
  baseURL: import.meta.env.VITE_TASKS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

tasksApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

tasksApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
