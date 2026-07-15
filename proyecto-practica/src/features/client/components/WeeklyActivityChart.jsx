export const WeeklyActivityChart = ({ data, loading }) => {
  const maxValue = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold text-text-primary">
        Actividad de Tareas <span className="font-normal text-text-secondary">(últimos 7 días)</span>
      </h2>
      <div className="mt-6 flex h-40 items-end gap-3">
        {loading
          ? [...Array(7)].map((_, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full animate-pulse rounded-t-md bg-border/60"
                  style={{ height: `${30 + (index % 3) * 20}%` }}
                />
              </div>
            ))
          : data.map(({ day, value }) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-text-secondary">{value}</span>
                <div
                  className="w-full rounded-t-md bg-success/80 transition-all"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-text-secondary">{day}</span>
              </div>
            ))}
      </div>
    </div>
  )
}
