import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import type { Event, Quiz } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Trophy } from 'lucide-react'

export default function EmployeeDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Event[] }>('/api/events')
      return response.data.data
    },
  })

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Quiz[] }>('/api/quiz/results')
      return response.data.data
    },
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const hasCompletedQuiz = (eventId: string) => {
    return quizzes?.some((quiz) => quiz.eventId === eventId)
  }

  const getQuizForEvent = (eventId: string) => {
    return quizzes?.find((quiz) => quiz.eventId === eventId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.fullName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Events</h2>
          
          {eventsLoading ? (
            <p>Loading events...</p>
          ) : events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.filter((event) => event.status === 'ACTIVE').map((event) => {
                const quiz = getQuizForEvent(event.id)
                const completed = hasCompletedQuiz(event.id)

                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Start: {new Date(event.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          End: {new Date(event.endDate).toLocaleDateString()}
                        </p>

                        {completed ? (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center text-green-600">
                              <Trophy className="mr-2 h-4 w-4" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                            <p className="text-sm">
                              Score: {quiz?.correctAnswers}/{quiz?.totalQuestions} ({quiz?.score.toFixed(0)}%)
                            </p>
                            {quiz?.isPassed && quiz?.spinCode && (
                              <Button
                                className="w-full"
                                onClick={() => navigate(`/employee/spin/${quiz.spinCode}`)}
                              >
                                Spin the Wheel!
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            className="w-full mt-4"
                            onClick={() => navigate(`/employee/quiz/${event.id}`)}
                          >
                            Start Quiz
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No active events at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
