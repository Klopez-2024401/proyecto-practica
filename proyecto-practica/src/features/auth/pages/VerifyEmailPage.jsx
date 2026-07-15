import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import {
  AuthShell,
  AuthPrimaryButton,
  AuthSwitchLink,
  CheckCircleIcon,
  AlertIcon,
} from '../../../shared/components/auth/index.js'

const REDIRECT_DELAY_MS = 3000

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const verifyEmail = useAuthStore((state) => state.verifyEmail)
  const hasRun = useRef(false)

  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (!email || !token) {
      setStatus('error')
      setMessage('El enlace de verificación no es válido.')
      return
    }

    verifyEmail(email, token).then((result) => {
      if (result.success) {
        setStatus('success')
        setMessage('Tu cuenta ya está activa. Ya puedes iniciar sesión.')
      } else if (result.status === 409) {
        // La cuenta ya había sido verificada antes (ej. se abrió el enlace dos veces)
        setStatus('success')
        setMessage('Tu cuenta ya estaba verificada. Ya puedes iniciar sesión.')
      } else {
        setStatus('error')
        setMessage(result.error)
      }
    })
  }, [email, token, verifyEmail])

  useEffect(() => {
    if (status !== 'success') return

    const timeoutId = setTimeout(() => navigate('/login'), REDIRECT_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [status, navigate])

  return (
    <AuthShell
      title={
        status === 'verifying'
          ? 'Verificando tu cuenta'
          : status === 'success'
            ? 'Cuenta verificada'
            : 'No se pudo verificar'
      }
      subtitle={
        status === 'verifying'
          ? 'Un momento, estamos confirmando tu correo...'
          : message
      }
    >
      <div className="flex flex-col items-center gap-5">
        {status === 'verifying' && (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-secondary" />
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className="h-14 w-14 text-success" />
            <p className="text-center text-xs text-text-secondary">
              Serás redirigido a iniciar sesión en unos segundos...
            </p>
            <AuthPrimaryButton type="button" onClick={() => navigate('/login')}>
              Ir a iniciar sesión
            </AuthPrimaryButton>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertIcon className="h-14 w-14 text-error" />
            <AuthSwitchLink actionText="Volver a iniciar sesión" to="/login" />
          </>
        )}
      </div>
    </AuthShell>
  )
}
