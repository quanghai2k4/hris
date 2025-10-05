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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  LogOut,
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
    <TooltipProvider delayDuration={0}>
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
          <div className="flex h-full max-h-screen flex-col overflow-x-hidden">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 overflow-hidden">
              <div className={`flex items-center font-semibold transition-all duration-300 ${isCollapsed ? 'justify-center w-full gap-0' : 'gap-2'}`}>
                <Calendar className="h-6 w-6 shrink-0" />
                <span className={`truncate transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  HRIS Platform
                </span>
              </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto md:hidden transition-all duration-200 hover:bg-neutral-400 hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            </div>
            
            <div className="flex-1 overflow-auto py-2">
              <nav className={`grid items-start text-sm font-medium transition-all duration-300 ${isCollapsed ? 'px-0 justify-items-center' : 'px-2 lg:px-4'}`}>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  
                  const menuButton = (
                    <Button
                      variant="ghost"
                      className={`mb-1 ${isCollapsed ? 'w-10 h-10 p-0 gap-0 flex justify-center items-center' : 'w-full justify-start gap-3'} ${isActive ? 'opacity-100 border border-input shadow-sm' : 'opacity-50'} overflow-hidden transition-all duration-300 hover:bg-neutral-400 hover:text-white hover:opacity-100`}
                      onClick={() => {
                        navigate(item.href)
                        setIsMobileOpen(false)
                      }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className={`truncate transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        {item.title}
                      </span>
                    </Button>
                  )
                  
                  return isCollapsed ? (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild className="w-full flex justify-center">
                        {menuButton}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-white text-xs">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : <div key={item.href}>{menuButton}</div>
                })}
              </nav>
            </div>

          <div className={`mt-auto transition-all duration-300 ${isCollapsed ? 'px-2 py-4' : 'p-4'}`}>
            <Separator className={`mb-4 transition-all duration-300 ${isCollapsed ? 'mx-auto w-10' : ''}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`transition-all duration-300 hover:bg-neutral-400 hover:text-white rounded-xl flex items-center shadow-sm hover:shadow-md ${isCollapsed ? 'w-10 h-10 p-0 mx-auto justify-center' : 'w-full gap-2 justify-start'}`}
                >
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
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-56 bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer transition-all duration-150 focus:bg-neutral-400 focus:text-white data-[highlighted]:bg-neutral-400 data-[highlighted]:text-white">
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
            className="md:hidden transition-all duration-200 hover:bg-neutral-400 hover:text-white"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex transition-all duration-200 hover:bg-neutral-400 hover:text-white"
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
    </TooltipProvider>
  )
}
