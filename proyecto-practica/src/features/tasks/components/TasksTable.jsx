import { ClipboardIcon, AlertIcon, PencilIcon, TrashIcon } from './TaskIcons.jsx'

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

export const TasksTable = ({ tasks, loading, error, onCreate, onEdit, onDelete, onStatusChange }) => {
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} />
  if (tasks.length === 0) return <EmptyState onCreate={onCreate} />

  return (
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
                  onChange={(event) => onStatusChange(task, event.target.value)}
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
                    onClick={() => onEdit(task)}
                    aria-label="Editar tarea"
                    className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(task)}
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
  )
}
