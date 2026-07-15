import { create } from 'zustand'
import { authApi } from '../../../shared/api/authApi.js'
import { saveSession, getToken, getUser, clearSession } from '../../../shared/utils/authSession.js'

export const useAuthStore = create((set) => ({
  user: getUser(),
  token: getToken(),
  loading: false,
  error: null,

  login: async ({ emailOrUsername, password }) => {
    set({ loading: true, error: null })

    try {
      const response = await authApi.post('/auth/login', {
        emailOrUsername,
        password,
      })

      const { token, user } = response.data
      saveSession(token, user)
      set({ user, token, loading: false, error: null })

      return { success: true, data: response.data }
    } catch (err) {
      const message =
        err.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.'
      set({ loading: false, error: message })

      return {
        success: false,
        error: message,
        status: err.response?.status,
        email: err.response?.data?.email,
      }
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null })

    try {
      const response = await authApi.post('/auth/register', formData)
      set({ loading: false, error: null })

      return { success: true, data: response.data }
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      const message =
        backendErrors?.[0]?.message ||
        err.response?.data?.message ||
        'No se pudo crear la cuenta. Intenta de nuevo.'
      set({ loading: false, error: message })

      return { success: false, error: message }
    }
  },

  verifyEmail: async (email, token) => {
    set({ loading: true, error: null })

    try {
      const response = await authApi.post('/auth/verify-email', { email, token })
      set({ loading: false, error: null })

      return { success: true, data: response.data }
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo verificar la cuenta.'
      set({ loading: false, error: message })

      return { success: false, error: message, status: err.response?.status }
    }
  },

  resendVerification: async (email) => {
    try {
      await authApi.post('/auth/resend-verification', { email })
      return { success: true }
    } catch {
      return { success: false }
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null })

    try {
      const response = await authApi.post('/auth/forgot-password', { email })
      set({ loading: false, error: null })

      return { success: true, message: response.data.message }
    } catch (err) {
      const message =
        err.response?.data?.message || 'No se pudo procesar la solicitud. Intenta de nuevo.'
      set({ loading: false, error: message })

      return { success: false, error: message }
    }
  },

  logout: () => {
    clearSession()
    set({ user: null, token: null })
  },
}))
