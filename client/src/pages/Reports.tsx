import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Award, Trophy } from 'lucide-react'

export default function Reports() {
  const navigate = useNavigate()

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await api.get('/api/reports/dashboard')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/hr/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
              <CardDescription>Overview of all events</CardDescription>
            </CardHeader>
            <CardContent>
              {reportData?.events && reportData.events.length > 0 ? (
                <div className="space-y-4">
                  {reportData.events.map((event: any) => (
                    <div key={event.id} className="flex justify-between items-center p-3 border rounded-lg">
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Results</CardTitle>
              <CardDescription>Latest quiz completions</CardDescription>
            </CardHeader>
            <CardContent>
              {reportData?.topParticipants && reportData.topParticipants.length > 0 ? (
                <div className="space-y-3">
                  {reportData.topParticipants.slice(0, 10).map((result: any) => (
                    <div
                      key={result.user.id + result.completedAt}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{result.user.fullName}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(result.completedAt).toLocaleString()}
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

        <Card>
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
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{spin.event || 'Unknown Event'}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(spin.spunAt).toLocaleString()}
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
      </main>
    </div>
  )
}

