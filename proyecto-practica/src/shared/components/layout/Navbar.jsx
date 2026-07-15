import { Link } from 'react-router-dom'
import logoImg from '../../../assets/img/logo.png'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-text-primary group">
          <div className="h-9 w-9 overflow-hidden rounded-xl border border-border/40 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-white">
            <img
              src={logoImg}
              alt="Kairo Logo"
              className="h-full w-full scale-[1.85] object-cover"
            />
          </div>
          <span className="tracking-tight text-text-primary transition-colors group-hover:text-primary">
            Kairo
          </span>
        </Link>

        {/* Center Links (hidden on mobile, shown on md+) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#features" className="transition-colors hover:text-text-primary">
            Funciones
          </a>
          <a href="#pricing" className="transition-colors hover:text-text-primary">
            Precios
          </a>
          <div className="relative group cursor-pointer flex items-center gap-1 transition-colors hover:text-text-primary py-1">
            <span>Recursos</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-1 hidden w-40 rounded-xl border border-border bg-card p-2 shadow-lg group-hover:block animate-fade-in">
              <a href="#docs" className="block rounded-lg px-3 py-2 text-xs hover:bg-surface hover:text-text-primary">
                Documentación
              </a>
              <a href="#guides" className="block rounded-lg px-3 py-2 text-xs hover:bg-surface hover:text-text-primary">
                Guías de Inicio
              </a>
              <a href="#support" className="block rounded-lg px-3 py-2 text-xs hover:bg-surface hover:text-text-primary">
                Soporte Técnico
              </a>
            </div>
          </div>
          <a href="#blog" className="transition-colors hover:text-text-primary">
            Blog
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/login"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/25 active:scale-[0.98]"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  )
}

