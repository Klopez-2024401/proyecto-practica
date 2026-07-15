import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-gray-900">
          Kairo
        </Link>
        <Link
          to="/login"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Iniciar sesión
        </Link>
      </nav>
    </header>
  )
}
