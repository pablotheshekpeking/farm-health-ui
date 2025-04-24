import { useQuery } from "@tanstack/react-query"

export function useAnimalDetail(id) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      const response = await fetch(`/api/animals/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch animal details')
      }
      return response.json()
    },
    enabled: !!id // Only run the query if we have an ID
  })
} 