import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface QuestionData {
  id: string
  content: string
  type: string
  answers: Array<{
    id: string
    content: string
    orderIndex: number
  }>
}

interface QuizSession {
  sessionId: string
  questions: QuestionData[]
  startedAt: string
}

interface QuizResult {
  result: {
    totalQuestions: number
    correctAnswers: number
    score: number
    passedThreshold: boolean
  }
  spinCode: string | null
}

export default function QuizPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<QuizSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const startQuiz = useMutation({
    mutationFn: async () => {
      if (!eventId) {
        throw new Error('Event ID is missing')
      }
      console.log('Starting quiz with eventId:', eventId)
      const response = await api.post<{ success: boolean; data: QuizSession }>('/api/quiz/start', {
        eventId,
      })
      console.log('Quiz start response:', response.data)
      return response.data.data
    },
    onSuccess: (data: QuizSession) => {
      setSession(data)
      toast({
        title: 'Quiz started!',
        description: `You have ${data.questions.length} questions to answer`,
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to start quiz',
        description: error.response?.data?.message || error.message || 'Please try again',
      })
      navigate('/employee/dashboard')
    },
  })

  const submitAnswer = useMutation({
    mutationFn: async ({
      sessionId,
      questionId,
      answerId,
    }: {
      sessionId: string
      questionId: string
      answerId: string
    }) => {
      const response = await api.post('/api/quiz/answer', {
        sessionId,
        questionId,
        answerId,
      })
      return response.data
    },
  })

  const submitQuiz = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post<{ success: boolean; data: QuizResult }>('/api/quiz/submit', {
        sessionId,
      })
      return response.data.data
    },
    onSuccess: (data: QuizResult) => {
      setResult(data)
      toast({
        title: 'Quiz submitted!',
        description: `You scored ${data.result.correctAnswers}/${data.result.totalQuestions}`,
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })

  useEffect(() => {
    if (!session && !isStarting) {
      setIsStarting(true)
      startQuiz.mutate()
    }
  }, [])

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))

    if (session) {
      submitAnswer.mutate({
        sessionId: session.sessionId,
        questionId,
        answerId,
      })
    }
  }

  const handleNext = () => {
    if (session && currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (!session) return

    submitQuiz.mutate(session.sessionId)
  }

  const isAllAnswered = () => {
    if (!session) return false
    return session.questions.every((q) => selectedAnswers[q.id])
  }

  if (startQuiz.isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (!session.questions || session.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>No questions available for this event</p>
            <Button className="mt-4" onClick={() => navigate('/employee/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-center">Quiz Completed!</CardTitle>
            <CardDescription className="text-center">
              Here are your results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {result.result.correctAnswers}/{result.result.totalQuestions}
              </p>
              <p className="text-2xl font-semibold text-gray-700 mt-2">
                {result.result.score.toFixed(0)}%
              </p>
              <p className="text-gray-600 mt-2">
                {result.result.passedThreshold ? 'Congratulations! You passed!' : 'Keep trying!'}
              </p>
            </div>

            {result.result.passedThreshold && result.spinCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Your Spin Code:
                </p>
                <p className="text-2xl font-bold text-blue-600 text-center">
                  {result.spinCode}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {result.result.passedThreshold && result.spinCode && (
                <Button
                  className="w-full"
                  onClick={() => navigate(`/employee/spin/${result.spinCode}`)}
                >
                  Spin the Wheel!
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/employee/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = session.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/employee/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.content}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.answers.map((answer) => (
                <div key={answer.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={answer.id} id={`answer-${answer.id}`} />
                  <Label htmlFor={`answer-${answer.id}`} className="cursor-pointer">
                    {answer.content}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {currentQuestionIndex === session.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isAllAnswered() || submitQuiz.isPending}
                >
                  {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-2 justify-center">
          {session.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`h-3 w-3 rounded-full ${
                selectedAnswers[q.id]
                  ? 'bg-blue-600'
                  : index === currentQuestionIndex
                  ? 'bg-blue-300'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
