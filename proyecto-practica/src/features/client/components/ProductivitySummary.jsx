export const ProductivitySummary = ({ completed, pending, completedPercentage, loading }) => (
  <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
    <h2 className="text-sm font-semibold text-text-primary">Resumen de Productividad</h2>

    {loading ? (
      <div className="mt-6 flex items-center gap-6">
        <div className="h-36 w-36 shrink-0 animate-pulse rounded-full bg-border/60" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-border/60" />
          <div className="h-4 w-32 animate-pulse rounded bg-border/60" />
        </div>
      </div>
    ) : (
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        <div
          className="relative h-36 w-36 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(var(--color-success) ${completedPercentage * 3.6}deg, var(--color-border) 0deg)`,
          }}
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
            <span className="text-2xl font-bold text-text-primary">{completedPercentage}%</span>
            <span className="text-xs text-text-secondary">Completadas</span>
          </div>
        </div>
        <div className="flex-1 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-text-secondary">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              Completadas
            </span>
            <span className="font-semibold text-text-primary">{completed}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-text-secondary">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              Pendientes
            </span>
            <span className="font-semibold text-text-primary">{pending}</span>
          </div>
          <p className="pt-2 text-xs text-text-secondary">
            {completedPercentage >= 50
              ? 'Buen trabajo, llevas más de la mitad de tus tareas completadas.'
              : 'Vas por buen camino, sigue completando tus tareas pendientes.'}
          </p>
        </div>
      </div>
    )}
  </div>
)
