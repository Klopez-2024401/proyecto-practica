import { useEffect, useState } from 'react'
import { ClientDashboardLayout } from '../../../shared/components/layout/ClientDashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'
import { tasksApi } from '../../../shared/api/tasksApi.js'
import { notyfError, notyfSuccess } from '../../../shared/utils/notyf.js'
import { TaskFormModal } from '../components/TaskFormModal.jsx'
import { DeleteTaskDialog } from '../components/DeleteTaskDialog.jsx'

const ClipboardIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect x="5" y="4.5" width="14" height="17" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M9 4.5V3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V4.5"
      stroke="currentColor"
      strokeWidth="1.8"
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

const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const PencilIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m14.5 4.5 5 5L8 21H3v-5L14.5 4.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4.5 7h15M9.5 7V5.25A1.25 1.25 0 0 1 10.75 4h2.5A1.25 1.25 0 0 1 14.5 5.25V7M6.5 7l.75 12a1.5 1.5 0 0 0 1.5 1.5h6.5a1.5 1.5 0 0 0 1.5-1.5L17.5 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PRIORITY_BADGES = {
  Alta: 'bg-error/10 text-error',
  Media: 'bg-warning/10 text-warning',
  Baja: 'bg-success/10 text-success',
}

const STATUS_OPTIONS = ['Pendiente', 'En progreso', 'Completada']

const STATUS_SELECT_CLASSES = {
  Pendiente: 'bg-warning/10 text-warning',
  'En progreso': 'bg-secondary/10 text-secondary',
  Completada: 'bg-success/10 text-success',
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const Badge = ({ tone, children }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
    {children}
  </span>
)

const LoadingSkeleton = () => (
  <div className="divide-y divide-border/60">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-center gap-4 px-5 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-border/60" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-border/60" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-border/60" />
        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-border/60" />
      </div>
    ))}
  </div>
)

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <ClipboardIcon className="h-7 w-7" />
    </div>
    <p className="mt-4 text-sm font-semibold text-text-primary">No tienes tareas</p>
    <p className="mt-1 max-w-xs text-sm text-text-secondary">
      Cuando crees una tarea, aparecerá aquí con su prioridad, estado y fecha límite.
    </p>
    <button
      type="button"
      onClick={onCreate}
      className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-secondary"
    >
      Crear tu primera tarea
    </button>
  </div>
)

const ErrorState = ({ message }) => (
  <div className="mx-5 my-5 flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2.5 text-sm text-error">
    <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{message}</span>
  </div>
)

export const TasksPage = () => {
  const user = getUser()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [deletingTask, setDeletingTask] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await tasksApi.get('/')
      setTasks(response.data.data ?? [])
    } catch (err) {
      const message =
        err.response?.data?.message || 'No se pudieron cargar tus tareas. Intenta de nuevo.'
      setError(message)
      notyfError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const openCreateForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEditForm = (task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (submitting) return
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleFormSubmit = async (form) => {
    if (submitting) return
    setSubmitting(true)

    try {
      if (editingTask) {
        const response = await tasksApi.put(`/${editingTask._id}`, form)
        const updated = response.data.data
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
        notyfSuccess('Tarea actualizada')
      } else {
        const response = await tasksApi.post('/', form)
        const created = response.data.data
        setTasks((prev) => [created, ...prev])
        notyfSuccess('Tarea creada')
      }
      setFormOpen(false)
      setEditingTask(null)
    } catch (err) {
      notyfError(err.response?.data?.message || 'No se pudo guardar la tarea.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTask || deleting) return
    setDeleting(true)

    try {
      await tasksApi.delete(`/${deletingTask._id}`)
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id))
      notyfSuccess('Tarea eliminada')
      setDeletingTask(null)
    } catch (err) {
      notyfError(err.response?.data?.message || 'No se pudo eliminar la tarea.')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (task, estado) => {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, estado } : t)))

    try {
      const response = await tasksApi.patch(`/${task._id}/status`, { estado })
      const updated = response.data.data
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    } catch (err) {
      setTasks(previous)
      notyfError(err.response?.data?.message || 'No se pudo actualizar el estado.')
    }
  }

  return (
    <ClientDashboardLayout>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Mis tareas{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Todas tus tareas en un solo lugar.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-secondary active:scale-[0.98]"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva tarea
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} />
          ) : tasks.length === 0 ? (
            <EmptyState onCreate={openCreateForm} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-3">Título</th>
                    <th className="px-5 py-3">Prioridad</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Fecha límite</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {tasks.map((task) => (
                    <tr key={task._id} className="transition-colors hover:bg-surface">
                      <td className="px-5 py-4 font-medium text-text-primary">{task.titulo}</td>
                      <td className="px-5 py-4">
                        <Badge tone={PRIORITY_BADGES[task.prioridad] ?? 'bg-border/40 text-text-secondary'}>
                          {task.prioridad}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={task.estado}
                          onChange={(event) => handleStatusChange(task, event.target.value)}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                            STATUS_SELECT_CLASSES[task.estado] ?? 'bg-border/40 text-text-secondary'
                          }`}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-text-secondary">{formatDate(task.fecha)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditForm(task)}
                            aria-label="Editar tarea"
                            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTask(task)}
                            aria-label="Eliminar tarea"
                            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-error/10 hover:text-error"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TaskFormModal
        open={formOpen}
        task={editingTask}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onCancel={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </ClientDashboardLayout>
  )
}
