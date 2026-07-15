export const DeleteTaskDialog = ({ task, onCancel, onConfirm, deleting }) => {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text-primary/40" onClick={onCancel} />
      <div className="animate-fade-in relative w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-xl">
        <h2 className="text-lg font-bold text-text-primary">Eliminar tarea</h2>
        <p className="mt-2 text-sm text-text-secondary">
          ¿Seguro que quieres eliminar <span className="font-medium text-text-primary">"{task.titulo}"</span>?
          Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-error px-4 py-2 text-sm font-semibold text-white shadow-md shadow-error/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
