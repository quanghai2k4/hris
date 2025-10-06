import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('EMPLOYEE' | 'HR_MANAGER' | 'ADMIN')[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'HR_MANAGER' || user.role === 'ADMIN' ? '/hr/dashboard' : '/employee/dashboard'
    return <Navigate to={defaultPath} replace />
  }

  return <>{children}</>
}
