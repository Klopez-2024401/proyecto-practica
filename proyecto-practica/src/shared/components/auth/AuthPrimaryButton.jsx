import { SpinnerIcon } from './AuthIcons.jsx'

export const AuthPrimaryButton = ({
  type = 'button',
  loading,
  loadingText,
  disabled,
  children,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary disabled:hover:shadow-md"
    {...rest}
  >
    {loading && <SpinnerIcon className="h-4 w-4 animate-spin" />}
    {loading ? loadingText : children}
  </button>
)
