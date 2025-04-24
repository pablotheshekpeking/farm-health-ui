import { useQuery } from "@tanstack/react-query"

export function useAnimalDetails({
  page = 1,
  limit = 10,
  search = "",
  breedId = "all",
  healthStatus = "all"
}) {
  return useQuery({
    queryKey: ['animals', { page, limit, search, breedId, healthStatus }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(breedId !== "all" && { breedId }),
        ...(healthStatus !== "all" && { healthStatus })
      })

      const response = await fetch(`/api/animals?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch animals')
      }
      return response.json()
    }
  })
} 