import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, BarChart, TrendingUp, Users, DollarSign, Home } from 'lucide-react'
import { formatDateVN } from '@/lib/datetime'

export default function HRDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const overviewRef = useRef<HTMLButtonElement>(null)
  const analyticsRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = activeTab === 'overview' ? overviewRef : analyticsRef
      if (activeRef.current) {
        const { offsetLeft, offsetWidth } = activeRef.current
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
    updateIndicator()
  }, [activeTab])

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
  const topParticipants = dashboardData?.topParticipants || []
  const recentSpins = dashboardData?.recentSpins || []

  const activeEvents = events.filter((e: any) => e.status === 'ACTIVE').length

  const navItems = [
    { title: 'Dashboard', href: '/hr/dashboard', icon: Home },
    { title: 'Event Management', href: '/hr/events', icon: Calendar },
    { title: 'Reports', href: '/hr/reports', icon: BarChart },
    { title: 'User Management', href: '/hr/users', icon: Users },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      DRAFT: 'secondary',
      PAUSED: 'outline',
      COMPLETED: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your HRIS platform performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="border bg-white/90 relative">
            <TabsTrigger 
              ref={overviewRef}
              value="overview" 
              className="transition-all hover:scale-[1.01] data-[state=inactive]:opacity-50 relative z-10"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              ref={analyticsRef}
              value="analytics" 
              className="transition-all hover:scale-[1.01] data-[state=inactive]:opacity-50 relative z-10"
            >
              Analytics
            </TabsTrigger>
            <div 
              className="absolute inset-y-1 border-2 border-primary rounded-md transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`
              }}
            />
          </TabsList>

          <TabsContent value="overview" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    +{events?.length || 0} total events
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuizzes}</div>
                  <p className="text-xs text-muted-foreground">
                    {passedQuizzes} passed quizzes
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{passRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Of all quiz attempts
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSpins}</div>
                  <p className="text-xs text-muted-foreground">
                    Prizes awarded
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="bg-white/90 col-span-4 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>
                    Latest quiz events in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead className="text-right">Spins</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.length > 0 ? (
                        events.slice(0, 5).map((event: any) => (
                          <TableRow 
                            key={event.id} 
                            className="cursor-pointer hover:bg-muted/50 animate-in fade-in-0 slide-in-from-left-2 duration-300"
                          >
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{getStatusBadge(event.status)}</TableCell>
                            <TableCell>{event.participants || 0}</TableCell>
                            <TableCell className="text-right">{event.spins || 0}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="bg-white/90 col-span-3 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Top Participants</CardTitle>
                  <CardDescription>
                    Highest performing employees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topParticipants.length > 0 ? (
                      topParticipants.slice(0, 5).map((participant: any, index: number) => (
                        <div 
                          key={participant.userId} 
                          className="flex items-center animate-in fade-in-0 slide-in-from-right-2 duration-300"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                            <span className="text-sm font-medium">#{index + 1}</span>
                          </div>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {participant.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Score: {participant.score}%
                            </p>
                          </div>
                          <div className="ml-auto font-medium">
                            <Badge variant="outline">1 quiz</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        No participants yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-white/90 cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate('/hr/events')}>
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Create and manage quiz events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Events
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate('/hr/reports')}>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>View detailed reports and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 cursor-pointer transition-shadow hover:shadow-lg" onClick={() => navigate('/hr/users')}>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full border transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <Card className="bg-white/90 transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle>Recent Spin Results</CardTitle>
                <CardDescription>Latest prize distributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Prize Amount</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSpins.length > 0 ? (
                      recentSpins.map((spin: any) => (
                        <TableRow 
                          key={spin.id}
                          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                        >
                          <TableCell className="font-medium">{spin.user?.fullName}</TableCell>
                          <TableCell>{spin.event}</TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {parseFloat(spin.amount).toLocaleString('vi-VN')}đ
                          </TableCell>
                          <TableCell className="text-right">
                            {formatDateVN(spin.spunAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No spin results yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
