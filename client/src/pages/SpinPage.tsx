import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Gift, Home } from 'lucide-react'

const PRIZES = [
  'Amazon Gift Card $50',
  'Starbucks Voucher',
  'Extra Day Off',
  'Lunch with CEO',
  'Tech Gadget',
  'Wellness Package',
  'Book Voucher',
  'Movie Tickets',
]

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#36A2EB',
]

interface SpinResultData {
  prize: string
  amount: number
}

export default function SpinPage() {
  const { spinCode } = useParams<{ spinCode: string }>()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<SpinResultData | null>(null)

  const spin = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post<{ success: boolean; data: { amount: number; spunAt: string } }>('/api/spin/execute', { code })
      return response.data.data
    },
    onSuccess: (data) => {
      const prizeIndex = Math.floor(Math.random() * PRIZES.length)
      const targetRotation = 360 * 5 + (prizeIndex * (360 / PRIZES.length))
      animateSpin(targetRotation, () => {
        setResult({
          prize: `${data.amount.toLocaleString('vi-VN')}đ`,
          amount: data.amount,
        })
        toast({
          title: 'Congratulations!',
          description: `You won: ${data.amount.toLocaleString('vi-VN')}đ`,
        })
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Spin failed',
        description: error.response?.data?.message || 'This code may have already been used',
      })
    },
  })

  const drawWheel = (canvas: HTMLCanvasElement, currentRotation: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((currentRotation * Math.PI) / 180)

    const sliceAngle = (2 * Math.PI) / PRIZES.length

    PRIZES.forEach((prize, index) => {
      const startAngle = index * sliceAngle
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[index % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px "Google Sans Code", monospace'
      ctx.fillText(prize, radius * 0.65, 0)
      ctx.restore()
    })

    ctx.restore()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius - 20)
    ctx.lineTo(centerX - 10, centerY - radius - 5)
    ctx.lineTo(centerX + 10, centerY - radius - 5)
    ctx.closePath()
    ctx.fillStyle = '#000'
    ctx.fill()
  }

  const animateSpin = (targetRotation: number, onComplete: () => void) => {
    setIsSpinning(true)
    const duration = 5000
    const startTime = Date.now()
    const startRotation = rotation

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = startRotation + easeOut * (targetRotation - startRotation)

      setRotation(currentRotation % 360)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        onComplete()
      }
    }

    animate()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = 400
      canvas.height = 400
      drawWheel(canvas, rotation)
    }
  }, [rotation])

  const handleSpin = () => {
    if (!spinCode || isSpinning || result) return
    spin.mutate(spinCode)
  }

  const navItems = [
    { title: 'Dashboard', href: '/employee/dashboard', icon: Home },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-lg transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Prize Wheel</CardTitle>
            <CardDescription className="text-center">
              Click the button below to spin and win a prize!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>

            {result ? (
              <div className="w-full space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Gift className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-2xl font-bold text-green-700">{result.prize}</p>
                </div>
                <Button
                  className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                  onClick={() => navigate('/employee/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                onClick={handleSpin}
                disabled={isSpinning || spin.isPending}
              >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
