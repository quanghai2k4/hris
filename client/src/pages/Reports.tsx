import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, BarChart, Home, Users, Award, Trophy } from 'lucide-react'
import { formatDateTimeVN } from '@/lib/datetime'

export default function Reports() {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await api.get('/api/reports/dashboard')
      return response.data
    },
  })

  const navItems = [
    { title: 'Dashboard', href: '/hr/dashboard', icon: Home },
    { title: 'Event Management', href: '/hr/events', icon: Calendar },
    { title: 'Reports', href: '/hr/reports', icon: BarChart },
    { title: 'User Management', href: '/hr/users', icon: Users },
  ]

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48 mt-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-4">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View detailed reports and statistics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '0ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.events?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active events in system
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '75ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Results</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.summary?.totalParticipants || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total quiz completions
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '150ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData?.summary?.passRate?.toFixed(0) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of all quiz attempts
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData?.summary?.totalSpins || 0}</div>
              <p className="text-xs text-muted-foreground">
                Prizes awarded
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
              <CardDescription>Overview of all events</CardDescription>
            </CardHeader>
            <CardContent>
              {reportData?.events && reportData.events.length > 0 ? (
                <div className="space-y-4">
                  {reportData.events.map((event: any, index: number) => (
                    <div
                      key={event.id}
                      className="flex justify-between items-center p-3 border rounded-lg animate-in fade-in-0 slide-in-from-left-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div>
                        <p className="text-sm font-medium">{event.name}</p>
                        <p className="text-xs text-gray-600">{event.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{event.participants || 0} quizzes</p>
                        <p className="text-xs text-gray-600">{event.spins || 0} spins</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No events available</p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle>Recent Quiz Results</CardTitle>
              <CardDescription>Latest quiz completions</CardDescription>
            </CardHeader>
            <CardContent>
              {reportData?.topParticipants && reportData.topParticipants.length > 0 ? (
                <div className="space-y-3">
                  {reportData.topParticipants.slice(0, 10).map((result: any, index: number) => (
                    <div
                      key={result.user.id + result.completedAt}
                      className="flex justify-between items-center p-3 border rounded-lg animate-in fade-in-0 slide-in-from-right-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div>
                        <p className="text-sm font-medium">{result.user.fullName}</p>
                        <p className="text-xs text-gray-600">
                          {formatDateTimeVN(result.completedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Score: {result.score?.toFixed(0)}%</span>
                        {result.score >= 70 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Passed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No quiz results yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Spin Results</CardTitle>
            <CardDescription>Recent spin outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {reportData?.recentSpins && reportData.recentSpins.length > 0 ? (
              <div className="space-y-3">
                {reportData.recentSpins.slice(0, 10).map((spin: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div>
                      <p className="text-sm font-medium">{spin.event || 'Unknown Event'}</p>
                      <p className="text-xs text-gray-600">
                        {formatDateTimeVN(spin.spunAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">${spin.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No spin results yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
