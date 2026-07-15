export const AuthInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  rules,
  error,
  autoComplete,
  icon: Icon,
  rightElement,
  disabled,
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-text-primary"
    >
      {label}
    </label>
    <div className="group relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary transition-colors group-focus-within:text-secondary" />
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        {...register(id, rules)}
        className={`w-full rounded-xl border bg-white py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 ${
          Icon ? 'pl-10' : 'pl-3'
        } ${rightElement ? 'pr-10' : 'pr-3'} ${
          error
            ? 'border-error focus:border-error focus:ring-error/15'
            : 'border-border focus:border-secondary focus:ring-secondary/15'
        }`}
      />
      {rightElement}
    </div>
    {error && <p className="mt-1 text-xs text-error">{error.message}</p>}
  </div>
)
