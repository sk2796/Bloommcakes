import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function UserNavButton() {
  const { user } = useAuthStore()

  // Get first name or short display name if logged in
  const displayName = user?.name ? user.name.split(' ')[0] : 'Login'

  return (
    <Link
      to={user ? '/account' : '/login'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface transition-all duration-200 shadow-sm"
      aria-label={user ? `User account: ${user.name}` : 'Login to account'}
      title={user ? `Logged in as ${user.name}` : 'Login / Sign Up'}
    >
      <span className="material-symbols-outlined text-base leading-none text-primary" data-icon="person">
        person
      </span>
      <span className="font-bold text-xs text-primary truncate max-w-[80px] sm:max-w-[110px]">
        {user ? displayName : 'Login'}
      </span>
    </Link>
  )
}
