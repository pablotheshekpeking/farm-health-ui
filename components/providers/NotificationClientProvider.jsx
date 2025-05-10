"use client"
import { useNotifications } from "../../app/hooks/useNotifications"
import { useShowBrowserNotification } from "../../hooks/useBrowserNotification"

export default function NotificationClientProvider() {
  const { data } = useNotifications()
  const notificationList = data?.notifications || []
  useShowBrowserNotification(notificationList)
  return null
}
