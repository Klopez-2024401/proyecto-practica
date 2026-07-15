import { useEffect, useState } from 'react'
import { ClientDashboardLayout } from '../../../shared/components/layout/ClientDashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'
import { productivityApi } from '../../../shared/api/productivityApi.js'
import { tasksApi } from '../../../shared/api/tasksApi.js'
import { notyfError } from '../../../shared/utils/notyf.js'

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

const DashboardSkeleton = () => (
  <div className="mx-auto max-w-6xl animate-pulse">
    <div className="h-8 w-48 rounded bg-border/60" />
    <div className="mt-1 h-4 w-64 rounded bg-border/60" />

    {/* Stat Cards Skeleton */}
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-border/60" />
          <div className="mt-4 h-8 w-16 rounded bg-border/60" />
          <div className="mt-1 h-4 w-24 rounded bg-border/60" />
          <div className="mt-2 h-3 w-32 rounded bg-border/60" />
        </div>
      ))}
    </div>

    {/* Middle Row Skeleton */}
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="h-56 rounded-2xl border border-border/60 bg-card p-6 shadow-sm" />
      <div className="h-56 rounded-2xl border border-border/60 bg-card p-6 shadow-sm" />
    </div>

    {/* Bottom Row Skeleton */}
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="h-56 rounded-2xl border border-border/60 bg-card p-6 shadow-sm" />
      <div className="h-56 rounded-2xl border border-border/60 bg-card p-6 shadow-sm" />
    </div>
  </div>
)

const ErrorState = ({ message }) => (
  <div className="mx-auto max-w-6xl">
    <div className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2.5 text-sm text-error">
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  </div>
)

export const ClientDashboardPage = () => {
  const user = getUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completedPercentage: 0,
    pendingPercentage: 0,
    overdueTasksCount: 0,
    weeklyActivity: [],
    recentActivity: [],
    upcomingDue: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch metrics and tasks in parallel
        const [dashboardRes, overdueRes, tasksRes] = await Promise.all([
          productivityApi.get('/dashboard'),
          productivityApi.get('/tasks/overdue'),
          tasksApi.get('/'),
        ])

        const dashboardData = dashboardRes.data.data
        const overdueTasks = overdueRes.data.data
        const allTasks = tasksRes.data.data ?? []

        // Calculate recently completed tasks
        const completedTasksSorted = allTasks
          .filter((t) => t.estado === 'Completada')
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3)
          .map((t) => ({
            title: t.titulo,
            meta: `Completada · ${new Date(t.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
            done: true,
          }))

        // Calculate upcoming due tasks
        const upcomingTasksSorted = allTasks
          .filter((t) => t.estado !== 'Completada' && t.fecha)
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .slice(0, 3)
          .map((t) => {
            const diffDays = Math.ceil((new Date(t.fecha) - new Date()) / (1000 * 60 * 60 * 24))
            const meta =
              diffDays < 0
                ? `Venció hace ${Math.abs(diffDays)} día(s)`
                : diffDays === 0
                  ? 'Vence hoy'
                  : `Vence en ${diffDays} día(s)`
            return {
              title: t.titulo,
              meta,
            }
          })

        // Group the last 7 days weekly activity
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        const today = new Date()
        const last7Days = []

        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(today.getDate() - i)
          last7Days.push({
            day: daysOfWeek[d.getDay()],
            dateString: d.toDateString(),
            value: 0,
          })
        }

        allTasks.forEach((t) => {
          if (t.createdAt) {
            const createdDate = new Date(t.createdAt).toDateString()
            const matchDay = last7Days.find((d) => d.dateString === createdDate)
            if (matchDay) {
              matchDay.value++
            }
          }
        })

        setData({
          totalTasks: dashboardData.totalTasks,
          completedTasks: dashboardData.completedTasks,
          pendingTasks: dashboardData.pendingTasks,
          completedPercentage: dashboardData.completedPercentage,
          pendingPercentage: dashboardData.pendingPercentage,
          overdueTasksCount: overdueTasks.length,
          weeklyActivity: last7Days,
          recentActivity: completedTasksSorted,
          upcomingDue: upcomingTasksSorted,
        })
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err)
        setError('No se pudieron cargar los datos de productividad.')
        notyfError('Error al conectar con el servicio de productividad.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <ClientDashboardLayout>
        <DashboardSkeleton />
      </ClientDashboardLayout>
    )
  }

  if (error) {
    return (
      <ClientDashboardLayout>
        <ErrorState message={error} />
      </ClientDashboardLayout>
    )
  }

  const STAT_CARDS = [
    {
      label: 'Tareas Totales',
      value: data.totalTasks,
      trend: 'Total acumulado',
      trendPositive: true,
      icon: ClipboardIcon,
      color: 'primary',
    },
    {
      label: 'Completadas',
      value: data.completedTasks,
      trend: `${data.completedPercentage}% del total`,
      trendPositive: true,
      icon: CheckCircleIcon,
      color: 'success',
    },
    {
      label: 'Pendientes',
      value: data.pendingTasks,
      trend: `${data.pendingPercentage}% del total`,
      trendPositive: false,
      icon: ClockIcon,
      color: 'warning',
    },
    {
      label: 'Vencidas',
      value: data.overdueTasksCount,
      trend: 'Requieren atención',
      trendPositive: false,
      icon: AlertIcon,
      color: 'error',
    },
  ]

  const maxWeeklyValue = Math.max(...data.weeklyActivity.map((d) => d.value), 1)

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
                  background: `conic-gradient(var(--color-success) ${data.completedPercentage * 3.6}deg, var(--color-border) 0deg)`,
                }}
              >
                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
                  <span className="text-2xl font-bold text-text-primary">
                    {data.completedPercentage}%
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
                  <span className="font-semibold text-text-primary">
                    {data.completedTasks} ({data.completedPercentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    Pendientes
                  </span>
                  <span className="font-semibold text-text-primary">
                    {data.pendingTasks} ({data.pendingPercentage}%)
                  </span>
                </div>
                <p className="pt-2 text-xs text-text-secondary">
                  {data.completedPercentage >= 50
                    ? 'Buen trabajo, llevas más de la mitad de tus tareas completadas.'
                    : 'Sigue adelante, ¡puedes completar más tareas hoy!'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">
              Actividad de Tareas <span className="font-normal text-text-secondary">(últimos 7 días)</span>
            </h2>
            <div className="mt-6 flex h-40 items-end gap-3">
              {data.weeklyActivity.map(({ day, value }) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary">{value}</span>
                  <div
                    className="w-full rounded-t-md bg-success/80 transition-all"
                    style={{ height: `${(value / maxWeeklyValue) * 100}%` }}
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
              {data.recentActivity.length === 0 ? (
                <p className="text-sm text-text-secondary py-2">No hay actividad reciente.</p>
              ) : (
                data.recentActivity.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircleIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-secondary">{item.meta}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-text-primary">Próximos Vencimientos</h2>
            <ul className="mt-4 space-y-4">
              {data.upcomingDue.length === 0 ? (
                <p className="text-sm text-text-secondary py-2">No hay tareas pendientes.</p>
              ) : (
                data.upcomingDue.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                      <ClipboardIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="text-xs text-error">{item.meta}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  )
}
