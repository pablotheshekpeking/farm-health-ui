"use client"

import { Bell, AlertTriangle, Info, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/app/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ClientDate from "@/components/ClientDate"
import { Badge } from "@/components/ui/badge"

export default function NotificationDropdown() {
  const { data, isLoading } = useNotifications()
  const notificationList = data?.notifications || []
  const unreadCount = notificationList.filter(n => !n.read).length
  const firstFive = notificationList.slice(0, 3)

  // Function to determine notification type and icon
  const getNotificationType = (message) => {
    if (message.toLowerCase().includes('sick')) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
        type: 'alert',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20'
      }
    }
    return {
      icon: <Info className="h-4 w-4 text-primary" />,
      type: 'info',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1">
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        ) : firstFive.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p>No notifications</p>
          </div>
        ) : (
          <>
            {firstFive.map((n) => {
              const { icon, type, bgColor, borderColor } = getNotificationType(n.message)
              return (
                <DropdownMenuItem 
                  key={n.id} 
                  className={`
                    p-3 border-b last:border-b-0
                    ${!n.read ? `${bgColor} ${borderColor}` : ''}
                    hover:bg-accent
                  `}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="mt-0.5">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-2">
                        {n.message}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-muted-foreground">
                          <ClientDate dateString={n.createdAt} />
                        </div>
                        {!n.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
            <div className="border-t">
              <DropdownMenuItem asChild>
                <Link 
                  href="/notifications" 
                  className="flex items-center justify-between w-full text-primary font-medium py-2"
                >
                  <span>View all notifications</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
