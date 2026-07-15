import { AuthShell } from '../../../shared/components/auth/index.js'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm.jsx'

export const ForgotPasswordPage = () => {
  return (
    <AuthShell
      title="Recupera tu contraseña"
      subtitle="Te enviaremos instrucciones a tu correo."
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
