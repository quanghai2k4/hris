import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import EmployeeDashboard from '@/pages/EmployeeDashboard'
import QuizPage from '@/pages/QuizPage'
import SpinPage from '@/pages/SpinPage'
import HRDashboard from '@/pages/HRDashboard'
import EventManagement from '@/pages/EventManagement'
import Reports from '@/pages/Reports'
import UserManagement from '@/pages/UserManagement'

const queryClient = new QueryClient()

function RootRedirect() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role === 'HR_MANAGER') {
    return <Navigate to="/hr/dashboard" replace />
  }
  
  return <Navigate to="/employee/dashboard" replace />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="animate-in fade-in-0 duration-300">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={<RootRedirect />} />
              
              <Route
                path="/employee/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/employee/quiz/:eventId"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/employee/spin/:spinCode"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                    <SpinPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['HR_MANAGER']}>
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/hr/events"
                element={
                  <ProtectedRoute allowedRoles={['HR_MANAGER']}>
                    <EventManagement />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/hr/reports"
                element={
                  <ProtectedRoute allowedRoles={['HR_MANAGER']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/hr/users"
                element={
                  <ProtectedRoute allowedRoles={['HR_MANAGER']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
