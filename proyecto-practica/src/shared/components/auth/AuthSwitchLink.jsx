import { Link } from 'react-router-dom'

export const AuthSwitchLink = ({
  prefixText,
  actionText,
  to,
  className = 'text-center text-sm text-text-secondary',
}) => (
  <p className={className}>
    {prefixText && `${prefixText} `}
    <Link
      to={to}
      className="font-medium text-secondary transition-colors hover:text-primary"
    >
      {actionText}
    </Link>
  </p>
)
