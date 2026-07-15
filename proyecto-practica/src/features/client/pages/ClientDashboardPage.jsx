import { useEffect, useState } from 'react'
import { ClientDashboardLayout } from '../../../shared/components/layout/ClientDashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'
import { tasksApi } from '../../../shared/api/tasksApi.js'
import { productivityApi } from '../../../shared/api/productivityApi.js'
import { notyfError } from '../../../shared/utils/notyf.js'
import { StatsGrid } from '../components/StatsGrid.jsx'
import { ProductivitySummary } from '../components/ProductivitySummary.jsx'
import { WeeklyActivityChart } from '../components/WeeklyActivityChart.jsx'
import { RecentActivityCard } from '../components/RecentActivityCard.jsx'
import { UpcomingDueCard } from '../components/UpcomingDueCard.jsx'

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const buildWeeklyActivity = (tasks) => {
  const counts = Array(7).fill(0)
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 6)

  tasks.forEach((task) => {
    if (task.estado !== 'Completada' || !task.updatedAt) return
    const updated = new Date(task.updatedAt)
    if (updated < weekAgo || updated > now) return
    counts[updated.getDay()] += 1
  })

  return WEEKDAY_ORDER.map((dayIndex) => ({
    day: WEEKDAY_LABELS[dayIndex],
    value: counts[dayIndex],
  }))
}

const formatRelative = (value) => {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffHours = Math.round(diffMs / 3600000)
  if (diffHours < 1) return 'hace unos minutos'
  if (diffHours < 24) return `hace ${diffHours} h`
  const diffDays = Math.round(diffHours / 24)
  return diffDays === 1 ? 'ayer' : `hace ${diffDays} días`
}

const formatDueIn = (value) => {
  const diffDays = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000)
  if (diffDays <= 0) return 'Vence hoy'
  return diffDays === 1 ? 'Vence en 1 día' : `Vence en ${diffDays} días`
}

const buildRecentActivity = (tasks) =>
  tasks
    .filter((task) => task.estado === 'Completada' && task.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)
    .map((task) => ({
      title: task.titulo,
      meta: `Completada · ${formatRelative(task.updatedAt)}`,
    }))

const buildUpcomingDue = (tasks) =>
  tasks
    .filter((task) => task.estado !== 'Completada' && task.fecha && new Date(task.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3)
    .map((task) => ({
      title: task.titulo,
      meta: formatDueIn(task.fecha),
    }))

export const ClientDashboardPage = () => {
  const user = getUser()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [upcomingDue, setUpcomingDue] = useState([])

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      setLoading(true)

      try {
        const [dashboardRes, overdueRes, tasksRes] = await Promise.all([
          productivityApi.get('/dashboard'),
          productivityApi.get('/tasks/overdue'),
          tasksApi.get('/'),
        ])

        if (cancelled) return

        const dashboard = dashboardRes.data.data
        const overdueCount = overdueRes.data.data?.length ?? 0
        const tasks = tasksRes.data.data ?? []

        setMetrics({
          total: dashboard.totalTasks,
          completed: dashboard.completedTasks,
          pending: dashboard.pendingTasks,
          overdue: overdueCount,
          completedPercentage: dashboard.completedPercentage,
          pendingPercentage: dashboard.pendingPercentage,
        })
        setWeeklyActivity(buildWeeklyActivity(tasks))
        setRecentActivity(buildRecentActivity(tasks))
        setUpcomingDue(buildUpcomingDue(tasks))
      } catch (err) {
        if (!cancelled) {
          notyfError(
            err.response?.data?.message ||
              'No se pudo cargar el resumen de productividad. Intenta de nuevo.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ClientDashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Hola{user?.name ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen de tu productividad y actividad reciente.
        </p>

        <StatsGrid metrics={metrics} loading={loading} />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ProductivitySummary
            completed={metrics?.completed ?? 0}
            pending={metrics?.pending ?? 0}
            completedPercentage={metrics?.completedPercentage ?? 0}
            loading={loading}
          />
          <WeeklyActivityChart data={weeklyActivity} loading={loading} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RecentActivityCard items={recentActivity} loading={loading} />
          <UpcomingDueCard items={upcomingDue} loading={loading} />
        </div>
      </div>
    </ClientDashboardLayout>
  )
}
