import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore.js'
import {
  AuthInput,
  AuthPrimaryButton,
  AuthSwitchLink,
  MailIcon,
} from '../../../shared/components/auth/index.js'
import { notyfError } from '../../../shared/utils/notyf.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const ForgotPasswordForm = () => {
  const forgotPassword = useAuthStore((state) => state.forgotPassword)
  const loading = useAuthStore((state) => state.loading)
  const [successMessage, setSuccessMessage] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email }) => {
    setSuccessMessage(null)
    const result = await forgotPassword(email.trim())

    if (result.success) {
      setSuccessMessage(result.message)
      return
    }

    notyfError(result.error || 'No se pudo procesar la solicitud.')
  }

  if (successMessage) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm text-text-secondary">{successMessage}</p>
        <AuthSwitchLink actionText="Volver a iniciar sesión" to="/login" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <AuthInput
        id="email"
        label="Correo electrónico"
        icon={MailIcon}
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        register={register}
        rules={{
          required: 'El correo electrónico es obligatorio.',
          pattern: { value: EMAIL_PATTERN, message: 'El correo no tiene un formato válido.' },
        }}
        error={errors.email}
        disabled={loading}
      />

      <AuthPrimaryButton type="submit" loading={loading} loadingText="Enviando...">
        Enviar instrucciones
      </AuthPrimaryButton>

      <AuthSwitchLink actionText="Volver a iniciar sesión" to="/login" />
    </form>
  )
}
