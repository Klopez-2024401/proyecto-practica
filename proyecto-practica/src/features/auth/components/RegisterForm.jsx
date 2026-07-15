import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import {
  AuthInput,
  AuthPrimaryButton,
  AuthSwitchLink,
  AuthAvatarPicker,
  UserIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  EyeIcon,
  EyeOffIcon,
} from '../../../shared/components/auth/index.js'
import { notyfSuccess, notyfError } from '../../../shared/utils/notyf.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/
const PHONE_PATTERN = /^\d{8}$/

export const RegisterForm = () => {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)
  const loading = useAuthStore((state) => state.loading)

  const [showPassword, setShowPassword] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name.trim())
    formData.append('surname', data.surname.trim())
    formData.append('username', data.username.trim())
    formData.append('email', data.email.trim())
    formData.append('password', data.password)

    if (data.phone?.trim()) {
      formData.append('phone', data.phone.trim())
    }
    if (photoFile) {
      formData.append('profilePicture', photoFile)
    }

    const result = await registerUser(formData)

    if (result.success) {
      notyfSuccess('Cuenta creada. Revisa tu correo para verificar tu cuenta.')
      navigate('/login')
      return
    }

    notyfError(result.error || 'No se pudo crear la cuenta')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <AuthAvatarPicker onFileSelect={setPhotoFile} disabled={loading} />

      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          id="name"
          label="Nombre"
          icon={UserIcon}
          register={register}
          rules={{
            required: 'El nombre es obligatorio.',
            minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres.' },
          }}
          error={errors.name}
          disabled={loading}
        />
        <AuthInput
          id="surname"
          label="Apellido"
          icon={UserIcon}
          register={register}
          rules={{
            required: 'El apellido es obligatorio.',
            minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres.' },
          }}
          error={errors.surname}
          disabled={loading}
        />
      </div>

      <AuthInput
        id="username"
        label="Nombre de usuario"
        icon={UserIcon}
        placeholder="usuario123"
        autoComplete="username"
        register={register}
        rules={{
          required: 'El nombre de usuario es obligatorio.',
          minLength: { value: 3, message: 'Mínimo 3 caracteres.' },
          maxLength: { value: 30, message: 'Máximo 30 caracteres.' },
          pattern: {
            value: USERNAME_PATTERN,
            message: 'Solo letras, números, guiones, guiones bajos y puntos.',
          },
        }}
        error={errors.username}
        disabled={loading}
      />

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

      <AuthInput
        id="phone"
        label="Teléfono (opcional)"
        icon={PhoneIcon}
        placeholder="12345678"
        autoComplete="tel"
        register={register}
        rules={{
          validate: (value) =>
            !value || PHONE_PATTERN.test(value) || 'El teléfono debe tener exactamente 8 dígitos.',
        }}
        error={errors.phone}
        disabled={loading}
      />

      <AuthInput
        id="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="new-password"
        icon={LockIcon}
        register={register}
        rules={{
          required: 'La contraseña es obligatoria.',
          minLength: { value: 8, message: 'Mínimo 8 caracteres.' },
        }}
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

      <AuthPrimaryButton type="submit" loading={loading} loadingText="Creando cuenta...">
        Crear cuenta
      </AuthPrimaryButton>

      <AuthSwitchLink
        prefixText="¿Ya tienes cuenta?"
        actionText="Inicia sesión"
        to="/login"
      />
    </form>
  )
}
