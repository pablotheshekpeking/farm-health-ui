import { useQuery } from "@tanstack/react-query"

export function useBreedDistribution() {
  return useQuery({
    queryKey: ['breedDistribution'],
    queryFn: async () => {
      const response = await fetch('/api/stats/breeds')
      if (!response.ok) {
        throw new Error('Failed to fetch breed distribution')
      }
      return response.json()
    }
  })
} 