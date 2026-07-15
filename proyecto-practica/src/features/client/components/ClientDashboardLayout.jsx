import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImg from '../../../assets/img/logo.png'
import { getUser, clearSession } from '../../../shared/utils/authSession.js'

const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m3.5 10.5 8-6.5 8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H4.5a1 1 0 0 1-1-1v-8.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChecklistIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m3.5 6 1.5 1.5L8 4.5M3.5 13l1.5 1.5L8 11.5M3.5 20l1.5 1.5L8 18.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 5.5h9M11.5 12.5h9M11.5 19.5h9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const FolderIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M3.5 6.75A1.75 1.75 0 0 1 5.25 5h4.19c.4 0 .78.16 1.06.44l1.06 1.06c.28.28.66.44 1.06.44h6.17a1.75 1.75 0 0 1 1.75 1.75v9.06a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V6.75Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect
      x="3.5"
      y="5"
      width="17"
      height="16"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3v4M16 3v4M3.5 10h17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M3.5 19.5c0-3 2.46-5 5.5-5s5.5 2 5.5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M15.5 4.6c1.4.4 2.4 1.7 2.4 3.2s-1 2.8-2.4 3.2M18 14.7c1.9.5 3.5 1.9 3.5 4.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const ReportsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5 20V10M12 20V4M19 20v-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const SettingsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V20a2.06 2.06 0 1 1-4.12 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H4a2.06 2.06 0 1 1 0-4.12h.09a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.06 2.06 0 1 1 2.92-2.92l.06.06a1.7 1.7 0 0 0 1.87.34H10.2a1.7 1.7 0 0 0 1.03-1.56V4a2.06 2.06 0 1 1 4.12 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.2a1.7 1.7 0 0 0 1.56 1.03H20a2.06 2.06 0 1 1 0 4.12h-.09a1.7 1.7 0 0 0-1.56 1.03Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BellIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M6 9.5a6 6 0 1 1 12 0c0 4.2 1.5 5.5 1.5 5.5H4.5S6 13.7 6 9.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.5a2 2 0 0 0 4 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const MenuIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4 6.5h16M4 12h16M4 17.5h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LogoutIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M14.5 4.5H8.75A2.25 2.25 0 0 0 6.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h5.75M17 15.5l3.5-3.5-3.5-3.5M20 12h-9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NAV_ITEMS = [
  { label: 'Inicio', to: '/client', icon: HomeIcon },
  { label: 'Tareas', to: '/tasks', icon: ChecklistIcon },
  { label: 'Proyectos', icon: FolderIcon },
  { label: 'Calendario', icon: CalendarIcon },
  { label: 'Equipo', icon: UsersIcon },
  { label: 'Reportes', icon: ReportsIcon },
]

const navItemClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
  }`

const SidebarContent = () => (
  <>
    <Link to="/" className="mb-8 flex items-center gap-2.5 px-1">
      <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-sm">
        <img
          src={logoImg}
          alt="Kairo"
          className="h-full w-full scale-[1.85] object-cover"
        />
      </div>
      <span className="text-lg font-bold tracking-tight text-text-primary">
        Kairo
      </span>
    </Link>

    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map(({ label, to, icon: Icon }) =>
        to ? (
          <NavLink key={label} to={to} end className={navItemClasses}>
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ) : (
          <button
            key={label}
            type="button"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        )
      )}
    </nav>

    <button
      type="button"
      className="mt-auto flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
    >
      <SettingsIcon className="h-5 w-5" />
      Configuración
    </button>
  </>
)

export const ClientDashboardLayout = ({ children }) => {
  const navigate = useNavigate()
  const user = getUser()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    clearSession()
    navigate('/')
  }

  const displayName = user?.name || 'Usuario'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card p-4 lg:flex">
        <SidebarContent />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-text-primary/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-64 flex-col border-r border-border/60 bg-card p-4">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-card/85 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface lg:hidden"
            aria-label="Abrir menú"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <h1 className="hidden text-lg font-bold tracking-tight text-text-primary sm:block">
            Dashboard
          </h1>

          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              type="button"
              className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              aria-label="Notificaciones"
            >
              <BellIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {initial}
                </div>
                <span className="hidden text-left text-sm sm:block">
                  <span className="block font-semibold text-text-primary">
                    {displayName}
                  </span>
                  <span className="block text-xs text-text-secondary">
                    Cliente
                  </span>
                </span>
                <ChevronDownIcon className="hidden h-4 w-4 text-text-secondary sm:block" />
              </button>

              {menuOpen && (
                <div className="animate-fade-in absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
