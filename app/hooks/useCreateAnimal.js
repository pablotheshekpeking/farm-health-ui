import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateAnimal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (animalData) => {
      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create animal')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries(['animalStats'])
      queryClient.invalidateQueries(['animals'])
    },
  })
} 