import { useEffect, useState } from 'react'

const toDateInputValue = (value) => {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

const emptyForm = {
  titulo: '',
  descripcion: '',
  prioridad: 'Media',
  estado: 'Pendiente',
  fecha: '',
}

export const TaskFormModal = ({ open, task, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              titulo: task.titulo || '',
              descripcion: task.descripcion || '',
              prioridad: task.prioridad || 'Media',
              estado: task.estado || 'Pendiente',
              fecha: toDateInputValue(task.fecha),
            }
          : emptyForm
      )
      setError(null)
    }
  }, [open, task])

  if (!open) return null

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.titulo.trim()) {
      setError('El título es obligatorio.')
      return
    }

    setError(null)
    await onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text-primary/40" onClick={onClose} />
      <div className="animate-fade-in relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-xl">
        <h2 className="text-lg font-bold text-text-primary">
          {task ? 'Editar tarea' : 'Nueva tarea'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Título
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={handleChange('titulo')}
              placeholder="Título de la tarea"
              disabled={submitting}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary transition-all focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              placeholder="Detalles de la tarea"
              rows={3}
              disabled={submitting}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary transition-all focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Prioridad
              </label>
              <select
                value={form.prioridad}
                onChange={handleChange('prioridad')}
                disabled={submitting}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:opacity-60"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Fecha límite
              </label>
              <input
                type="date"
                value={form.fecha}
                onChange={handleChange('fecha')}
                disabled={submitting}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15 disabled:opacity-60"
              />
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
