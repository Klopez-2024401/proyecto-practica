import { AuthShell } from '../../../shared/components/auth/index.js'
import { LoginForm } from '../components/LoginForm.jsx'

export const LoginPage = () => {
  return (
    <AuthShell
      title="Kairo"
      subtitle="Organiza tus tareas de manera rápida y eficiente."
    >
      <LoginForm />
    </AuthShell>
  )
}
