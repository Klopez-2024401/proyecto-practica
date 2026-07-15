import { Link } from 'react-router-dom'

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PlayIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8 6.82v10.36c0 .79.86 1.27 1.53.82l7.77-5.18c.58-.39.58-1.25 0-1.64L9.53 6c-.67-.45-1.53.03-1.53.82z" />
  </svg>
)

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-start text-left lg:col-span-5">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
        <CheckIcon className="h-3 w-3 stroke-[3]" />
        <span>Todo lo que necesitas para lograr más</span>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
        Organiza tu trabajo y maximiza tu{' '}
        <span className="relative inline-block text-success">
          productividad
          <svg
            className="absolute -bottom-2 left-0 h-2 w-full text-success/30"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0,5 Q50,10 100,5"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 text-lg text-text-secondary">
        Kairo te ayuda a planificar, organizar y colaborar en tus tareas
        diarias desde un solo lugar.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-secondary hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <span>Empieza Gratis</span>
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:bg-surface hover:border-text-secondary/25 active:scale-[0.98]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <PlayIcon className="h-3 w-3 translate-x-[0.5px]" />
          </span>
          <span>Ver cómo funciona</span>
        </button>
      </div>
    </div>
  )
}
