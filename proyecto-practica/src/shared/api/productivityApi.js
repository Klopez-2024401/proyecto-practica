import axios from 'axios'
import { getToken, clearSession } from '../utils/authSession.js'

export const productivityApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTIVITY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

productivityApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

productivityApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
