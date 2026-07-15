import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import {
  AuthInput,
  AuthPrimaryButton,
  AuthSwitchLink,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from '../../../shared/components/auth/index.js'
import { notyfSuccess, notyfError } from '../../../shared/utils/notyf.js'

const REMEMBERED_IDENTIFIER_KEY = 'rememberedIdentifier'

export const LoginForm = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const resendVerification = useAuthStore((state) => state.resendVerification)
  const loading = useAuthStore((state) => state.loading)

  const [showPassword, setShowPassword] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resendStatus, setResendStatus] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: localStorage.getItem(REMEMBERED_IDENTIFIER_KEY) || '',
      rememberMe: Boolean(localStorage.getItem(REMEMBERED_IDENTIFIER_KEY)),
    },
  })

  const onSubmit = async ({ emailOrUsername, password, rememberMe }) => {
    setUnverifiedEmail(null)
    setResendStatus(null)

    const result = await login({ emailOrUsername, password })

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_IDENTIFIER_KEY, emailOrUsername.trim())
      } else {
        localStorage.removeItem(REMEMBERED_IDENTIFIER_KEY)
      }

      notyfSuccess('¡Bienvenido de nuevo!')
      navigate('/tasks')
      return
    }

    notyfError(result.error || 'No se pudo iniciar sesión')
    if (result.status === 403) {
      // El backend siempre incluye el correo real de la cuenta en este caso,
      // aunque se haya iniciado sesión con el nombre de usuario.
      setUnverifiedEmail(result.email || null)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return

    setResendStatus('sending')
    const result = await resendVerification(unverifiedEmail)
    setResendStatus(result.success ? 'sent' : 'error')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <AuthInput
        id="emailOrUsername"
        label="Correo o nombre de usuario"
        placeholder="correo@ejemplo.com o usuario"
        autoComplete="username"
        icon={MailIcon}
        register={register}
        rules={{ required: 'El correo o nombre de usuario es obligatorio.' }}
        error={errors.emailOrUsername}
        disabled={loading}
      />

      <AuthInput
        id="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="current-password"
        icon={LockIcon}
        register={register}
        rules={{ required: 'La contraseña es obligatoria.' }}
        error={errors.password}
        disabled={loading}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        }
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-text-secondary select-none">
          <input
            type="checkbox"
            disabled={loading}
            className="h-4 w-4 rounded border-border text-secondary accent-secondary focus:ring-2 focus:ring-secondary/30"
            {...register('rememberMe')}
          />
          Recordarme
        </label>
        <AuthSwitchLink
          actionText="¿Olvidaste tu contraseña?"
          to="/forgot-password"
          className="text-sm"
        />
      </div>

      {unverifiedEmail && (
        <p className="text-xs text-text-secondary">
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
        </p>
      )}

      <AuthPrimaryButton type="submit" loading={loading} loadingText="Iniciando sesión...">
        Iniciar sesión
      </AuthPrimaryButton>

      <AuthSwitchLink
        prefixText="¿No tienes cuenta?"
        actionText="Regístrate"
        to="/register"
      />
    </form>
  )
}
