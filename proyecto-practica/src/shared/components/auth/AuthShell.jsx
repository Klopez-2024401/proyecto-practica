import logoImg from '../../../assets/img/logo.png'

const LogoMark = () => (
  <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl shadow-md shadow-primary/20">
    <img
      src={logoImg}
      alt="Kairo"
      className="h-full w-full scale-[1.85] object-cover"
    />
  </div>
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
    <path
      d="m12.5 6.5 5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const ClipboardCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect
      x="5"
      y="4.5"
      width="14"
      height="17"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M9 4.5V3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V4.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="m9 14 2.2 2.2L15.5 11.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChecklistIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m3.5 6 1.5 1.5L8 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m3.5 13 1.5 1.5L8 11.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m3.5 20 1.5 1.5L8 18.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 5.5h9M11.5 12.5h9M11.5 19.5h9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const CalendarCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect
      x="3.5"
      y="5"
      width="17"
      height="16"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3v4M16 3v4M3.5 10h17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="m8.5 15 1.8 1.8L14.5 13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FLOATING_ICONS = [
  {
    Icon: PencilIcon,
    className: 'left-[8%] top-[16%] h-9 w-9 text-primary/35',
    style: { '--float-rotate': '-12deg', animationDelay: '0s', animationDuration: '7s' },
  },
  {
    Icon: ClipboardCheckIcon,
    className: 'right-[10%] top-[12%] h-11 w-11 text-secondary/35',
    style: { '--float-rotate': '8deg', animationDelay: '0.8s', animationDuration: '8s' },
  },
  {
    Icon: ChecklistIcon,
    className: 'left-[12%] bottom-[18%] hidden h-10 w-10 text-secondary/35 sm:block',
    style: { '--float-rotate': '6deg', animationDelay: '1.6s', animationDuration: '9s' },
  },
  {
    Icon: CalendarCheckIcon,
    className: 'right-[8%] bottom-[14%] hidden h-9 w-9 text-primary/35 sm:block',
    style: { '--float-rotate': '-6deg', animationDelay: '0.4s', animationDuration: '7.5s' },
  },
  {
    Icon: PencilIcon,
    className: 'left-[4%] bottom-[38%] hidden h-8 w-8 text-primary/25 lg:block',
    style: { '--float-rotate': '20deg', animationDelay: '2.2s', animationDuration: '8.5s' },
  },
  {
    Icon: ClipboardCheckIcon,
    className: 'right-[4%] top-[42%] hidden h-8 w-8 text-secondary/25 lg:block',
    style: { '--float-rotate': '-10deg', animationDelay: '1.2s', animationDuration: '6.5s' },
  },
]

const FloatingIcons = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    {FLOATING_ICONS.map(({ Icon, className, style }, index) => (
      <Icon
        key={index}
        style={style}
        className={`absolute animate-float ${className}`}
      />
    ))}
  </div>
)

export const AuthShell = ({ title, subtitle, children }) => {
  return (
    <div className="bg-dot-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4">
      <FloatingIcons />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <LogoMark />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
