import { ClientDashboardLayout } from '../../../shared/components/layout/ClientDashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'

const ClipboardIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect
      x="5"
      y="4.5"
      width="14"
      height="17"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M9 4.5V3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V4.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
)

const CheckCircleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="m8.25 12.25 2.5 2.5 5-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ClockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v5l3.2 1.9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const AlertIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="15.75" r="0.9" fill="currentColor" />
  </svg>
)

const STAT_CARDS = [
  {
    label: 'Tareas Totales',
    value: 23,
    trend: '+15% vs. semana anterior',
    trendPositive: true,
    icon: ClipboardIcon,
    color: 'primary',
  },
  {
    label: 'Completadas',
    value: 12,
    trend: '+20% vs. semana anterior',
    trendPositive: true,
    icon: CheckCircleIcon,
    color: 'success',
  },
  {
    label: 'Pendientes',
    value: 7,
    trend: '-12% vs. semana anterior',
    trendPositive: false,
    icon: ClockIcon,
    color: 'warning',
  },
  {
    label: 'Vencidas',
    value: 4,
    trend: '-20% vs. semana anterior',
    trendPositive: false,
    icon: AlertIcon,
    color: 'error',
  },
]

const COLOR_CLASSES = {
  primary: { border: 'border-l-primary', badgeBg: 'bg-primary/10', badgeText: 'text-primary' },
  success: { border: 'border-l-success', badgeBg: 'bg-success/10', badgeText: 'text-success' },
  warning: { border: 'border-l-warning', badgeBg: 'bg-warning/10', badgeText: 'text-warning' },
  error: { border: 'border-l-error', badgeBg: 'bg-error/10', badgeText: 'text-error' },
}

const StatCard = ({ label, value, trend, trendPositive, icon: Icon, color }) => {
  const classes = COLOR_CLASSES[color]

  return (
    <div
      className={`rounded-2xl border border-border/60 border-l-4 ${classes.border} bg-card p-5 shadow-sm`}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${classes.badgeBg} ${classes.badgeText}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-2 text-xs font-medium ${trendPositive ? 'text-success' : 'text-error'}`}>
        {trend}
      </p>
    </div>
  )
}

const WEEKLY_ACTIVITY = [
  { day: 'Lun', value: 3 },
  { day: 'Mar', value: 5 },
  { day: 'Mié', value: 8 },
  { day: 'Jue', value: 6 },
  { day: 'Vie', value: 7 },
  { day: 'Sáb', value: 4 },
  { day: 'Dom', value: 3 },
]

const MAX_WEEKLY_VALUE = Math.max(...WEEKLY_ACTIVITY.map((d) => d.value))

const RECENT_ACTIVITY = [
  { title: 'Análisis de métricas del sitio web', meta: 'Completada · hace 2 horas', done: true },
  { title: 'Revisión de propuesta de diseño', meta: 'Completada · ayer', done: true },
  { title: 'Reunión de seguimiento semanal', meta: 'Completada · hace 2 días', done: true },
]

const UPCOMING_DUE = [
  { title: 'Diseñar nueva página de inicio', meta: 'Vence en 2 días' },
  { title: 'Preparar reporte mensual', meta: 'Vence en 4 días' },
  { title: 'Actualizar documentación', meta: 'Vence en 6 días' },
]

const completedPercent = 52

export const ClientDashboardPage = () => {
  const user = getUser()

  return (
    <ClientDashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Hola{user?.name ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen de tu productividad y actividad reciente.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">
              Resumen de Productividad
            </h2>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
              <div
                className="relative h-36 w-36 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--color-success) ${completedPercent * 3.6}deg, var(--color-border) 0deg)`,
                }}
              >
                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
                  <span className="text-2xl font-bold text-text-primary">
                    {completedPercent}%
                  </span>
                  <span className="text-xs text-text-secondary">Completadas</span>
                </div>
              </div>
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    Completadas
                  </span>
                  <span className="font-semibold text-text-primary">12 (52%)</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    Pendientes
                  </span>
                  <span className="font-semibold text-text-primary">11 (48%)</span>
                </div>
                <p className="pt-2 text-xs text-text-secondary">
                  Buen trabajo, llevas más de la mitad de tus tareas completadas.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">
              Actividad de Tareas <span className="font-normal text-text-secondary">(últimos 7 días)</span>
            </h2>
            <div className="mt-6 flex h-40 items-end gap-3">
              {WEEKLY_ACTIVITY.map(({ day, value }) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary">{value}</span>
                  <div
                    className="w-full rounded-t-md bg-success/80 transition-all"
                    style={{ height: `${(value / MAX_WEEKLY_VALUE) * 100}%` }}
                  />
                  <span className="text-xs text-text-secondary">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">Actividad Reciente</h2>
            <ul className="mt-4 space-y-4">
              {RECENT_ACTIVITY.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckCircleIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    <p className="text-xs text-text-secondary">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">Próximos Vencimientos</h2>
            <ul className="mt-4 space-y-4">
              {UPCOMING_DUE.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                    <ClipboardIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.title}</p>
                    <p className="text-xs text-error">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  )
}
