import axios from 'axios'
import { getToken } from '../utils/authSession.js'

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

authApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
