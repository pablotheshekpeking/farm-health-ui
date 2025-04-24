import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useEditAnimal(id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/animals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update animal')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['animal', id] })
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })
} 