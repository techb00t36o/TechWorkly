import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requiredRole, requireOnboarding = false }) {
  const { user, role, onboardingComplete } = useAuth()
  const location = useLocation()

  // If no authenticated user, redirect to login and preserve the attempted URL
  // so we can return them there after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If the user's role doesn't match, redirect to their own dashboard
  // (prevents workers from accessing company/admin routes and vice versa)
  if (requiredRole && role !== requiredRole) {
    const dashboardPath =
      role === 'company'
        ? '/dashboard/company'
        : role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard/worker'
    return <Navigate to={dashboardPath} replace />
  }

  // If the route requires completed onboarding and the user hasn't finished,
  // force them to the appropriate onboarding flow first
  if (requireOnboarding && !onboardingComplete) {
    const onboardPath = role === 'company' ? '/onboarding/company' : '/onboarding/worker'
    return <Navigate to={onboardPath} replace />
  }

  return children
}
