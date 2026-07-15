import { AuthShell } from '../../../shared/components/auth/index.js'
import { RegisterForm } from '../components/RegisterForm.jsx'

export const RegisterPage = () => {
  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Empieza a organizar tus tareas en minutos."
    >
      <RegisterForm />
    </AuthShell>
  )
}
