"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useBreeds } from "@/app/hooks/useBreeds"
import { Skeleton } from "@/components/ui/skeleton"
import { useCreateAnimal } from "@/app/hooks/useCreateAnimal"
import { toast } from "@/components/ui/use-toast"

export default function AddAnimalPage() {
  const router = useRouter()
  const { data: breeds, isLoading: breedsLoading, error: breedsError, isLoading: breedsIsLoading } = useBreeds()
  const createAnimal = useCreateAnimal()
  const [formData, setFormData] = useState({
    name: "",
    breedId: "",
    birthDate: null,
    weight: "",
    notes: "",
    sex: "FEMALE",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date,
    }))

    // Clear error when user selects date
    if (errors.birthDate) {
      setErrors((prev) => ({
        ...prev,
        birthDate: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = "Name is required"
    }

    if (!formData.breedId) {
      newErrors.breed = "Breed is required"
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required"
    } else {
      const today = new Date()
      if (formData.birthDate > today) {
        newErrors.birthDate = "Birth date cannot be in the future"
      }
    }

    if (!formData.weight) {
      newErrors.weight = "Weight is required"
    } else if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      newErrors.weight = "Weight must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createAnimal.mutateAsync(formData)
      
      toast({
        title: "Success",
        description: "Animal added successfully",
      })
      
      router.push("/animals")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create animal",
        variant: "destructive",
      })
    }
  }

  // Add sex selection to your form
  const sexSelect = (
    <div className="space-y-2">
      <Label htmlFor="sex">
        Sex <span className="text-destructive">*</span>
      </Label>
      <Select
        onValueChange={(value) => handleSelectChange("sex", value)}
        value={formData.sex}
      >
        <SelectTrigger id="sex">
          <SelectValue placeholder="Select sex" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MALE">Male</SelectItem>
          <SelectItem value="FEMALE">Female</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/animals">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Animal</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Animal Information</CardTitle>
            <CardDescription>Enter the details of the new animal to add to your farm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Animal Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter animal name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">
                  Breed <span className="text-destructive">*</span>
                </Label>
                {breedsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : breedsError ? (
                  <div className="text-sm text-destructive">
                    Error loading breeds. Please try again later.
                  </div>
                ) : (
                  <Select 
                    onValueChange={(value) => handleSelectChange("breedId", value)} 
                    value={formData.breedId}
                  >
                    <SelectTrigger
                      id="breed"
                      aria-invalid={errors.breed ? "true" : "false"}
                      aria-describedby={errors.breed ? "breed-error" : undefined}
                    >
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      {breeds?.map((breed) => (
                        <SelectItem key={breed.id} value={breed.id.toString()}>
                          {breed.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.breed && (
                  <p id="breed-error" className="text-sm text-destructive">
                    {errors.breed}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birthDate">
                  Birth Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !formData.birthDate && "text-muted-foreground"
                      } ${errors.birthDate ? "border-destructive" : ""}`}
                      id="birthDate"
                      aria-invalid={errors.birthDate ? "true" : "false"}
                      aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birthDate ? format(formData.birthDate, "PPP") : "Select birth date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={handleDateChange}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.birthDate && (
                  <p id="birthDate-error" className="text-sm text-destructive">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  value={formData.weight}
                  onChange={handleChange}
                  aria-invalid={errors.weight ? "true" : "false"}
                  aria-describedby={errors.weight ? "weight-error" : undefined}
                />
                {errors.weight && (
                  <p id="weight-error" className="text-sm text-destructive">
                    {errors.weight}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional notes about the animal"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sexSelect}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/animals">Cancel</Link>
            </Button>
            <Button type="submit" disabled={createAnimal.isPending}>
              {createAnimal.isPending ? "Saving..." : "Save Animal"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
