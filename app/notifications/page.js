"use client"

import { useNotifications } from "@/app/hooks/useNotifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, refetch } = useNotifications(page, limit)

  useEffect(() => {
    // Mark all as read when the page loads
    fetch('/api/notifications/mark-all-read', { method: 'PATCH' })
      .then(() => refetch())
      .catch(() => {})
  }, [refetch])

  const notifications = data?.notifications || []
  const totalPages = data?.pages || 1

  // Function to determine notification type and icon
  const getNotificationType = (message) => {
    if (message.toLowerCase().includes('sick')) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        type: 'alert',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20'
      }
    }
    return {
      icon: <Info className="h-5 w-5 text-primary" />,
      type: 'info',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {notifications.filter(n => !n.read).length} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {notifications.map((n) => {
                  const { icon, type, bgColor, borderColor } = getNotificationType(n.message)
                  return (
                    <li 
                      key={n.id} 
                      className={`
                        p-4 rounded-lg border transition-all duration-200
                        ${!n.read ? `${bgColor} ${borderColor}` : 'bg-card'}
                        hover:shadow-md
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-sm font-medium">
                            {n.message}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                            {!n.read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="flex justify-between items-center mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-2"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="gap-2"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
