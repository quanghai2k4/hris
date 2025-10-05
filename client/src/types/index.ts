export interface User {
  id: string
  employeeId: string
  fullName: string
  email: string
  role: 'EMPLOYEE' | 'HR_MANAGER'
}

export interface Event {
  id: string
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate: string
  isActive?: boolean
  createdAt: string
}

export interface Question {
  id: number
  eventId: number
  questionText: string
  options: string[]
  correctAnswer: string
  createdAt: string
}

export interface Quiz {
  id: string
  eventId: string
  eventName: string
  score: number
  totalQuestions: number
  correctAnswers: number
  isPassed: boolean
  spinCode: string | null
  completedAt: string
}

export interface QuizAnswer {
  questionId: number
  selectedAnswer: string
}

export interface QuizSubmission {
  eventId: number
  answers: QuizAnswer[]
}

export interface Spin {
  id: number
  userId: number
  eventId: number
  spinCode: string
  prize?: string
  spunAt?: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

export interface QuizResult {
  quiz: Quiz
  correctAnswers: number
  totalQuestions: number
  isPassed: boolean
  spinCode?: string
}

export interface SpinResult {
  spin: Spin
  prize: string
}

export interface ReportData {
  totalEmployees: number
  totalQuizzesTaken: number
  totalSpins: number
  averageScore: number
  passRate: number
  quizzesByEvent: Array<{
    eventId: number
    eventTitle: string
    count: number
  }>
  spinsByEvent: Array<{
    eventId: number
    eventTitle: string
    count: number
  }>
}
