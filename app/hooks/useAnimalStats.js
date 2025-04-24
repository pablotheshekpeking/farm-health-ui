import { useQuery } from "@tanstack/react-query"

async function fetchAnimalStats() {
  const response = await fetch('/api/animals/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch animal statistics')
  }
  return response.json()
}

export function useAnimalStats() {
  return useQuery({
    queryKey: ['animalStats'],
    queryFn: fetchAnimalStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
} 