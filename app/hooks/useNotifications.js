import { useQuery } from "@tanstack/react-query"

export function useNotifications(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?page=${page}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json()
    }
  })
}
