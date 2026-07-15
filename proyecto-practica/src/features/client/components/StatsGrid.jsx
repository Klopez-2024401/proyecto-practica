import { ClipboardIcon, CheckCircleIcon, ClockIcon, AlertIcon } from './DashboardIcons.jsx'

const COLOR_CLASSES = {
  primary: { border: 'border-l-primary', badgeBg: 'bg-primary/10', badgeText: 'text-primary' },
  success: { border: 'border-l-success', badgeBg: 'bg-success/10', badgeText: 'text-success' },
  warning: { border: 'border-l-warning', badgeBg: 'bg-warning/10', badgeText: 'text-warning' },
  error: { border: 'border-l-error', badgeBg: 'bg-error/10', badgeText: 'text-error' },
}

const StatCard = ({ label, value, icon: Icon, color, loading }) => {
  const classes = COLOR_CLASSES[color]

  return (
    <div
      className={`rounded-2xl border border-border/60 border-l-4 ${classes.border} bg-card p-5 shadow-sm`}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${classes.badgeBg} ${classes.badgeText}`}>
        <Icon className="h-5 w-5" />
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-12 animate-pulse rounded bg-border/60" />
      ) : (
        <p className="mt-4 text-3xl font-bold text-text-primary">{value}</p>
      )}
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  )
}

export const StatsGrid = ({ metrics, loading }) => {
  const cards = [
    { label: 'Tareas Totales', value: metrics?.total ?? 0, icon: ClipboardIcon, color: 'primary' },
    { label: 'Completadas', value: metrics?.completed ?? 0, icon: CheckCircleIcon, color: 'success' },
    { label: 'Pendientes', value: metrics?.pending ?? 0, icon: ClockIcon, color: 'warning' },
    { label: 'Vencidas', value: metrics?.overdue ?? 0, icon: AlertIcon, color: 'error' },
  ]

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} loading={loading} />
      ))}
    </div>
  )
}
