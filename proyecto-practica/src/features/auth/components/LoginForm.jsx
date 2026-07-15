import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../../shared/api/authApi.js'
import { saveSession } from '../../../shared/utils/authSession.js'
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
  SpinnerIcon,
} from './AuthIcons.jsx'

const REMEMBERED_EMAIL_KEY = 'rememberedEmail'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LoginForm = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState(
    () => localStorage.getItem(REMEMBERED_EMAIL_KEY) || ''
  )
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(
    () => Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY))
  )
  const [error, setError] = useState(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resendStatus, setResendStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return 'Correo y contraseña son obligatorios.'
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return 'El correo electrónico no tiene un formato válido.'
    }
    return null
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setUnverifiedEmail(null)
    setResendStatus(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.post('/auth/login', {
        email: email.trim(),
        password,
      })

      const { token, user } = response.data
      saveSession(token, user)

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim())
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }

      navigate('/tasks')
    } catch (err) {
      const status = err.response?.status
      const message =
        err.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.'

      setError(message)
      if (status === 403) {
        setUnverifiedEmail(email.trim())
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return

    setResendStatus('sending')
    try {
      await authApi.post('/auth/resend-verification', { email: unverifiedEmail })
      setResendStatus('sent')
    } catch {
      setResendStatus('error')
    }
  }

  return (
    <form onSubmit={handleLoginSubmit} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          Correo electrónico
        </label>
        <div className="group relative">
          <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-secondary" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            required
            disabled={isLoading}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary/60 transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          Contraseña
        </label>
        <div className="group relative">
          <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-secondary" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isLoading}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-secondary/60 transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-text-secondary select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-border text-secondary accent-secondary focus:ring-2 focus:ring-secondary/30"
          />
          Recordarme
        </label>
        <Link
          to="/forgot-password"
          className="font-medium text-secondary transition-colors hover:text-primary"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2.5 text-sm text-error animate-fade-in"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1.5">
            <span>{error}</span>
            {unverifiedEmail && (
              <div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                  className="font-medium text-secondary underline decoration-secondary/40 underline-offset-2 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendStatus === 'sent'
                    ? 'Código reenviado, revisa tu correo'
                    : resendStatus === 'sending'
                      ? 'Reenviando...'
                      : 'Reenviar código de verificación'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary disabled:hover:shadow-md"
      >
        {isLoading && <SpinnerIcon className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="text-center text-sm text-text-secondary">
        ¿No tienes cuenta?{' '}
        <Link
          to="/register"
          className="font-medium text-secondary transition-colors hover:text-primary"
        >
          Regístrate
        </Link>
      </p>
    </form>
  )
}
