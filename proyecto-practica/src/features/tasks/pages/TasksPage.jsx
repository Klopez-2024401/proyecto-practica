import { useEffect, useState } from 'react'
import { ClientDashboardLayout } from '../../../shared/components/layout/ClientDashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'
import { tasksApi } from '../../../shared/api/tasksApi.js'
import { notyfError, notyfSuccess } from '../../../shared/utils/notyf.js'
import { TaskFormModal } from '../components/TaskFormModal.jsx'
import { DeleteTaskDialog } from '../components/DeleteTaskDialog.jsx'
import { TasksTable } from '../components/TasksTable.jsx'
import { PlusIcon } from '../components/TaskIcons.jsx'

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
    if (!deletingTask) return
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
          <TasksTable
            tasks={tasks}
            loading={loading}
            error={error}
            onCreate={openCreateForm}
            onEdit={openEditForm}
            onDelete={setDeletingTask}
            onStatusChange={handleStatusChange}
          />
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
