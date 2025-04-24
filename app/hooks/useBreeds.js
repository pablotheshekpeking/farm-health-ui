import { useQuery } from "@tanstack/react-query"

async function fetchBreeds() {
  const response = await fetch('/api/breeds')
  if (!response.ok) {
    throw new Error('Failed to fetch breeds')
  }
  return response.json()
}

export function useBreeds() {
  return useQuery({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
  })
} 