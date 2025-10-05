import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Calendar, FileText, BarChart } from 'lucide-react'

export default function HRDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get<any>('/api/reports/dashboard')
      return response.data
    },
  })

  const events = dashboardData?.events || []
  const totalQuizzes = dashboardData?.summary?.totalParticipants || 0
  const totalSpins = dashboardData?.summary?.totalSpins || 0
  const passedQuizzes = dashboardData?.summary?.passedParticipants || 0
  const passRate = dashboardData?.summary?.passRate || 0

  const activeEvents = events.filter((e: any) => e.status === 'ACTIVE').length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.fullName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvents}</div>
              <p className="text-xs text-muted-foreground">
                Total events: {events?.length || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                Passed: {passedQuizzes}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passRate}%</div>
              <p className="text-xs text-muted-foreground">
                Of all quiz attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spins Completed</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpins}</div>
              <p className="text-xs text-muted-foreground">
                Total prizes awarded
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/hr/events')}>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Create and manage quiz events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/hr/reports')}>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>View detailed reports and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <BarChart className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest quiz events</CardDescription>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.startDate).toLocaleDateString()} -{' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {event.status === 'ACTIVE' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No events found</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
