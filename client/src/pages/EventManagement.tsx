import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Event } from '@/types'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDateVN } from '@/lib/datetime'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Edit, Trash2, Calendar as CalendarIcon, BarChart, Home, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function EventManagement() {
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: 10000000,
    config: {
      minScore: 70,
      questionCount: 10,
      prizeMin: 500000,
      prizeMax: 1000000,
      shuffleQuestions: true,
      shuffleAnswers: true,
    },
  })

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Event[] }>('/api/events')
      console.log('Events API response:', response.data)
      return response.data.data
    },
  })

  useEffect(() => {
    console.log('Events updated:', events)
  }, [events])

  const createEvent = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/api/events', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.refetchQueries({ queryKey: ['events'] })
      setIsCreateOpen(false)
      setStartDate(new Date())
      setEndDate(undefined)
      setFormData({ 
        name: '', 
        description: '', 
        startDate: '', 
        endDate: '',
        totalBudget: 10000000,
        config: {
          minScore: 70,
          questionCount: 10,
          prizeMin: 500000,
          prizeMax: 1000000,
          shuffleQuestions: true,
          shuffleAnswers: true,
        },
      })
      toast({
        title: 'Event created',
        description: 'The event has been created successfully',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create event',
        description: 'Please try again',
      })
    },
  })

  const toggleEventStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/api/events/${id}`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: 'Event updated',
        description: 'The event status has been updated',
      })
    },
  })

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/events/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: 'Event deleted',
        description: 'The event has been deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Cannot delete event',
        description: error.response?.data?.message || 'Please deactivate the event first or check if it has existing results',
      })
    },
  })

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
    }
    
    createEvent.mutate(submitData)
  }

  const navItems = [
    { title: 'Dashboard', href: '/hr/dashboard', icon: Home },
    { title: 'Event Management', href: '/hr/events', icon: CalendarIcon },
    { title: 'Reports', href: '/hr/reports', icon: BarChart },
    { title: 'User Management', href: '/hr/users', icon: Users },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Event Management</h2>
            <p className="text-muted-foreground">Create and manage quiz events</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="border transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Create a new quiz event for employees
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white z-[200]" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white z-[200]" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => startDate ? date < startDate : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {endDate && startDate && endDate < startDate && (
                    <p className="text-sm text-red-600">End date must be after start date</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="border transition-all duration-200 hover:bg-neutral-400 hover:text-white" disabled={createEvent.isPending || (endDate !== undefined && startDate !== undefined && endDate < startDate)}>
                  {createEvent.isPending ? 'Creating...' : 'Create Event'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Loading events...</p>
        ) : events && events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium">
                          {formatDateVN(event.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium">
                          {formatDateVN(event.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                        onClick={() =>
                          toggleEventStatus.mutate({
                            id: event.id,
                            status: event.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                          })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {event.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                            disabled={event.status === 'ACTIVE'}
                            title={event.status === 'ACTIVE' ? 'Deactivate the event before deleting' : 'Delete event'}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the event
                              and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border transition-all duration-200 hover:bg-neutral-400 hover:text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="border transition-all duration-200 hover:bg-neutral-400 hover:text-white"
                              onClick={() => deleteEvent.mutate(event.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">No events found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
