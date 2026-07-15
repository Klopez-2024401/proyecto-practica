import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../../shared/api/authApi.js'

const REMEMBERED_EMAIL_KEY = 'rememberedEmail'

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="m4 7 7.386 5.13a1 1 0 0 0 1.228 0L20 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect
      x="4.5"
      y="10.5"
      width="15"
      height="9.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7.75 10.5V7.75a4.25 4.25 0 1 1 8.5 0v2.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M2.25 12S5.25 5.25 12 5.25 21.75 12 21.75 12 18.75 18.75 12 18.75 2.25 12 2.25 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const EyeOffIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3 3l18 18M10.58 10.58a2.75 2.75 0 0 0 3.89 3.89M6.53 6.65C4.24 8.12 2.25 12 2.25 12S5.25 18.75 12 18.75c1.9 0 3.5-.53 4.8-1.28M9.88 5.4A9.5 9.5 0 0 1 12 5.25c6.75 0 9.75 6.75 9.75 6.75a15.6 15.6 0 0 1-2.53 3.63"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const AlertIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 8v5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15.75" r="0.9" fill="currentColor" />
  </svg>
)

const SpinnerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="opacity-90"
    />
  </svg>
)

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
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await authApi.post('/auth/login', {
        emailOrUsername: email,
        password,
      })

      const { token, userDetails } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', userDetails.role)

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }

      if (userDetails.role === 'PLATFORM_ADMIN') {
        navigate('/admin')
      } else {
        navigate('/client')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
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
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="font-medium text-secondary transition-colors hover:text-primary"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2.5 text-sm text-error animate-fade-in"
        >
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
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
    </form>
  )
}
