import { CheckCircleIcon } from './DashboardIcons.jsx'

export const RecentActivityCard = ({ items, loading }) => (
  <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
    <h2 className="text-sm font-semibold text-text-primary">Actividad Reciente</h2>

    {loading ? (
      <div className="mt-4 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-4 w-3/4 animate-pulse rounded bg-border/60" />
        ))}
      </div>
    ) : items.length === 0 ? (
      <p className="mt-4 text-sm text-text-secondary">Aún no has completado tareas.</p>
    ) : (
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
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
    )}
  </div>
)
