import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Event, Quiz } from '@/types'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Home, Trophy, Calendar, CheckCircle2, Clock, Coins } from 'lucide-react'
import { formatDateVN } from '@/lib/datetime'

export default function EmployeeDashboard() {
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

  const navItems = [
    { title: 'Dashboard', href: '/employee/dashboard', icon: Home },
    { title: 'Prize History', href: '/employee/prize-history', icon: Coins },
  ]

  const hasCompletedQuiz = (eventId: string) => {
    return quizzes?.some((quiz) => quiz.eventId === eventId)
  }

  const getQuizForEvent = (eventId: string) => {
    return quizzes?.find((quiz) => quiz.eventId === eventId)
  }

  const activeEvents = events?.filter((event) => event.status === 'ACTIVE') || []
  const completedQuizzes = quizzes?.length || 0
  const passedQuizzes = quizzes?.filter((quiz) => quiz.isPassed)?.length || 0

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your quiz activities
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Available to participate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                Total completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedQuizzes}/{completedQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                Passed quizzes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Active Events</h3>
            {activeEvents.length > 0 && (
              <Badge variant="outline">{activeEvents.length} available</Badge>
            )}
          </div>

          {eventsLoading ? (
            <Card className="bg-white/90 transition-shadow hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center">
                  <Clock className="mr-2 h-4 w-4 animate-pulse" />
                  <p className="text-sm text-muted-foreground">Loading events...</p>
                </div>
              </CardContent>
            </Card>
          ) : activeEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeEvents.map((event) => {
                const quiz = getQuizForEvent(event.id)
                const completed = hasCompletedQuiz(event.id)

                return (
                  <Card 
                    key={event.id} 
                    className="bg-white/90 hover:shadow-lg transition-shadow duration-500 animate-in fade-in-0 slide-in-from-left-4"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        {completed && (
                          <Badge variant="secondary" className="ml-2">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {formatDateVN(event.startDate)} - {formatDateVN(event.endDate)}
                          </span>
                        </div>

                        {completed ? (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Score:</span>
                                <span className="font-semibold">
                                  {quiz?.correctAnswers}/{quiz?.totalQuestions} ({quiz?.score.toFixed(0)}%)
                                </span>
                              </div>
                              {quiz?.isPassed ? (
                                <div className="space-y-2">
                                  <div className="flex items-center text-green-600 text-sm">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    <span className="font-medium">Quiz Passed!</span>
                                  </div>
                                   {quiz?.spinCode && (
                                    <Button
                                      className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                                      onClick={() => navigate(`/employee/spin/${quiz.spinCode}`)}
                                    >
                                      Spin the Wheel!
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-amber-600 font-medium">
                                  Did not pass - Try again next time
                                </div>
                              )}
                            </div>
                          </>
                         ) : (
                          <Button
                            className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
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
            <Card className="bg-white/90 transition-shadow hover:shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-2">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">No active events at the moment</p>
                  <p className="text-sm text-muted-foreground">Check back later for new quiz events</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {quizzes && quizzes.length > 0 && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-semibold">Recent Quiz Results</h3>
            <div className="space-y-2">
              {quizzes.slice(0, 5).map((quiz) => {
                const event = events?.find((e) => e.id === quiz.eventId)
                return (
                  <Card 
                    key={quiz.id} 
                    className="bg-white/90 animate-in fade-in-0 slide-in-from-right-4 duration-500 transition-shadow hover:shadow-lg"
                  >
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{event?.name || 'Unknown Event'}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed on {formatDateVN(quiz.completedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold">{quiz.score.toFixed(0)}%</p>
                            <p className="text-xs text-muted-foreground">
                              {quiz.correctAnswers}/{quiz.totalQuestions} correct
                            </p>
                          </div>
                          {quiz.isPassed ? (
                            <Badge variant="default" className="bg-green-500">
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
