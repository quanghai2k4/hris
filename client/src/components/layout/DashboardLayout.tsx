import { type ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: any
}

interface DashboardLayoutProps {
  children: ReactNode
  navItems: NavItem[]
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="flex min-h-screen">
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50
        border-r bg-background transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-16' : 'w-64'}
      `}>
        <div className="flex h-full max-h-screen flex-col gap-2 overflow-x-hidden">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 overflow-hidden">
            <div className={`flex items-center gap-2 font-semibold transition-all duration-300 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <Calendar className="h-6 w-6 shrink-0" />
              <span className={`truncate transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                HRIS Platform
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto md:hidden transition-transform duration-200 hover:rotate-90"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`mb-1 ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'} overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95`}
                    onClick={() => {
                      navigate(item.href)
                      setIsMobileOpen(false)
                    }}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className={`truncate transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                      {item.title}
                    </span>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className={`mt-auto overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-2 py-4' : 'p-4'}`}>
            <Separator className={`mb-4 transition-all duration-300 ${isCollapsed ? 'mx-auto w-10' : ''}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`transition-all duration-300 hover:bg-accent hover:scale-105 active:scale-95 rounded-xl flex ${isCollapsed ? 'w-10 h-10 p-0 mx-auto' : 'w-full gap-2 justify-start'}`}>
                  {isCollapsed ? (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback>{getInitials(user?.fullName || 'U')}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>{getInitials(user?.fullName || 'U')}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
                        <span className="text-sm font-medium truncate w-full">{user?.fullName}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{user?.email}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer transition-colors duration-150 hover:bg-destructive hover:text-destructive-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex transition-all duration-200 hover:scale-110 active:scale-95"
            onClick={() => {
              setIsCollapsed(prev => {
                const newState = !prev
                localStorage.setItem('sidebar-collapsed', String(newState))
                return newState
              })
            }}
          >
            {isCollapsed ? (
              <PanelLeft className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <PanelLeftClose className="h-5 w-5 transition-transform duration-200" />
            )}
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">
              {navItems.find((item) => item.href === location.pathname)?.title || 'Dashboard'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
