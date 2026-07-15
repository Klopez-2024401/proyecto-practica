import { useNavigate } from 'react-router-dom'
import { clearSession } from '../../utils/authSession.js'

export const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-gray-900">{title}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
