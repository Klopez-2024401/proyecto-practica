const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ChartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

export const FeaturesSection = () => {
  return (
    <section id="features" className="border-t border-border/20 bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            Potencia tu productividad
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            Características diseñadas para equipos modernos que quieren lograr más.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'Organización inteligente',
              description:
                'Organiza tus tareas, proyectos y plazos de manera intuitiva y eficiente.',
              icon: CalendarIcon,
              color: 'bg-primary/10 text-primary',
              hoverColor: 'group-hover:bg-primary group-hover:text-white',
            },
            {
              title: 'Colaboración en equipo',
              description:
                'Trabaja junto a tu equipo en tiempo real y mantén todo sincronizado.',
              icon: UsersIcon,
              color: 'bg-success/10 text-success',
              hoverColor: 'group-hover:bg-success group-hover:text-white',
            },
            {
              title: 'Análisis y reportes',
              description:
                'Visualiza el progreso, identifica oportunidades y toma mejores decisiones.',
              icon: ChartIcon,
              color: 'bg-indigo-500/10 text-indigo-500',
              hoverColor: 'group-hover:bg-indigo-500 group-hover:text-white',
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center rounded-2xl border border-border/40 bg-surface p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border/85"
              >
                {/* Feature Icon container */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${feature.color} ${feature.hoverColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="mt-6 text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>

                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-secondary"
                >
                  <span>Más información</span>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
