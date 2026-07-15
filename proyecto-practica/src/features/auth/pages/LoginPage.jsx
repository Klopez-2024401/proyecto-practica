import { LoginForm } from '../components/LoginForm.jsx'

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Iniciar sesión
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}
