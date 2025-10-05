import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Coins, Clock } from 'lucide-react'
import { formatDateVN } from '@/lib/datetime'

interface SpinHistory {
  id: string
  amount: number
  spunAt: string
  code: string
  event: {
    id: string
    name: string
  }
}

export default function PrizeHistoryPage() {
  const { data: spinHistory, isLoading } = useQuery({
    queryKey: ['spin-history'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: SpinHistory[] }>('/api/spin/history')
      return response.data.data
    },
  })

  const navItems = [
    { title: 'Dashboard', href: '/employee/dashboard', icon: Home },
    { title: 'Prize History', href: '/employee/prize-history', icon: Coins },
  ]

  const totalWinnings = spinHistory?.reduce((sum, spin) => sum + spin.amount, 0) || 0

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prize History</h2>
          <p className="text-muted-foreground">
            View all your prize winnings from spin events
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWinnings.toLocaleString('vi-VN')}đ</div>
              <p className="text-xs text-muted-foreground">
                From all spins
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spinHistory?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Spins completed
              </p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card className="bg-white/90 transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4 animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading prize history...</p>
              </div>
            </CardContent>
          </Card>
        ) : spinHistory && spinHistory.length > 0 ? (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-semibold">All Prizes</h3>
            <div className="space-y-2">
              {spinHistory.map((spin) => (
                <Card 
                  key={spin.id} 
                  className="bg-white/90 animate-in fade-in-0 slide-in-from-right-4 duration-500 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{spin.event.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Spun on {formatDateVN(spin.spunAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {spin.amount.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Code: {spin.code}
                          </p>
                        </div>
                        <Coins className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/90 transition-shadow hover:shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-2">
                <Coins className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground font-medium">No prize history yet</p>
                <p className="text-sm text-muted-foreground">Complete quizzes and spin the wheel to win prizes</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
