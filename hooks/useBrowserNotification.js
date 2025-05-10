'use client'
import { useEffect, useRef } from "react"

export function useShowBrowserNotification(notifications) {
  const lastNotificationId = useRef(null)

  useEffect(() => {
    if (!notifications || notifications.length === 0) return
    const latest = notifications[0]
    if (
      Notification.permission === "granted" &&
      latest.id !== lastNotificationId.current &&
      !latest.read // only for unread
    ) {
      new Notification("Animal Health Alert", {
        body: latest.message,
        icon: "/icon512_rounded.png",
        // You can add more options here
      })
      lastNotificationId.current = latest.id
    }
  }, [notifications])
}