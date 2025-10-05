import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Event } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from '@/components/ui/dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

export default function EventManagement() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: 10000,
    config: {
      minScore: 70,
      questionCount: 10,
      prizeMin: 100,
      prizeMax: 1000,
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
      setFormData({ 
        name: '', 
        description: '', 
        startDate: '', 
        endDate: '',
        totalBudget: 10000,
        config: {
          minScore: 70,
          questionCount: 10,
          prizeMin: 100,
          prizeMax: 1000,
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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEvent.mutate(formData)
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogPrimitive.Content
                  className={cn(
                    "fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
                  )}
                >
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Create a new quiz event for employees
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                    {createEvent.isPending ? 'Creating...' : 'Create Event'}
                  </Button>
                </form>
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
              </DialogPortal>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <p>Loading events...</p>
        ) : events && events.length > 0 ? (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id}>
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
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium">
                          {new Date(event.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleEventStatus.mutate({
                            id: event.id,
                            status: event.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
                          })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {event.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this event?')) {
                            deleteEvent.mutate(event.id)
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">No events found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
