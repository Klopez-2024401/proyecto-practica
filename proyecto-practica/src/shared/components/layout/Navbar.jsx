import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <header className="w-full border-b border-border/60 bg-card">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-text-primary">
          Kairo
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
          >
            Registrarse
          </button>
          <Link
            to="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/25 active:scale-[0.98]"
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </header>
  )
}
