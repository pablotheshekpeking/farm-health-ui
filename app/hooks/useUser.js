import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useUser() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/users/me')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      return response.json()
    }
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to update user data')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateUser: mutation.mutate,
    isUpdating: mutation.isPending
  }
} 