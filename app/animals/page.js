"use client"

import { useState, useCallback } from "react"
import { useDebounce } from "use-debounce"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PlusCircle, Search, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { useAnimalDetails } from "@/app/hooks/useAllAnimals"
import { useBreeds } from "@/app/hooks/useBreeds"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnimalTableSkeleton } from "@/app/components/AnimalTableSkeleton"

export default function AnimalsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch] = useDebounce(searchTerm, 300) // 300ms debounce
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBreed, setSelectedBreed] = useState("all")
  const [healthStatus, setHealthStatus] = useState("all")
  const itemsPerPage = 10

  const { data: breeds } = useBreeds()
  
  const { 
    data: animalData, 
    isLoading,
    isFetching,
    error 
  } = useAnimalDetails({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch, // Use debounced search value
    breedId: selectedBreed,
    healthStatus
  })

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleBreedFilter = (breedId) => {
    setSelectedBreed(breedId)
    setCurrentPage(1)
  }

  const handleHealthFilter = (status) => {
    setHealthStatus(status)
    setCurrentPage(1)
  }

  const handleDelete = async (animalId) => {
    if (confirm("Are you sure you want to delete this animal? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/animals/${animalId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete animal')
        }

        // Refetch the data to update the table
        router.refresh()
      } catch (error) {
        console.error("Error deleting animal:", error)
        // You might want to add a toast notification here for better UX
      }
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "healthy":
        return "success"
      case "sick":
        return "destructive"
      case "injured":
        return "destructive"
      case "pregnant":
        return "warning"
      default:
        return "outline"
    }
  }

  if (error) {
    return <div>Error loading animals</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Animals</h1>
          <p className="text-muted-foreground">Manage your livestock inventory</p>
        </div>
        <Button asChild>
          <Link href="/animals/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Animal
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Livestock Inventory</CardTitle>
          <CardDescription>View and manage all your registered animals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search animals..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <Select value={selectedBreed} onValueChange={handleBreedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All breeds</SelectItem>
                {breeds?.map((breed) => (
                  <SelectItem key={breed.id} value={breed.id.toString()}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={healthStatus} onValueChange={handleHealthFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Health status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="HEALTHY">Healthy</SelectItem>
                <SelectItem value="SICK">Sick</SelectItem>
                <SelectItem value="QUARANTINED">Quarantined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <AnimalTableSkeleton />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Age (months)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animalData?.animals.length > 0 ? (
                      animalData.animals.map((animal) => (
                        <TableRow key={animal.id}>
                          <TableCell className="font-medium">{animal.id}</TableCell>
                          <TableCell className="font-medium">{animal.name}</TableCell>
                          <TableCell>{animal.breed}</TableCell>
                          <TableCell>{animal.age}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(animal.status.toLowerCase())}>
                              {animal.status.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/animals/${animal.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={() => handleDelete(animal.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No animals found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {animalData?.pagination.pages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: animalData.pagination.pages }).map((_, index) => {
                        const pageNumber = index + 1
                        // Show first page, current page, last page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === animalData.pagination.pages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === currentPage}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === animalData.pagination.pages - 1 && currentPage < animalData.pagination.pages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => 
                            Math.min(prev + 1, animalData.pagination.pages)
                          )}
                          disabled={currentPage === animalData.pagination.pages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
