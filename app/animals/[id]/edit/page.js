"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useAnimalDetail } from "@/app/hooks/useAnimalDetail"
import { useEditAnimal } from "@/app/hooks/useEditAnimal"
import { useBreeds } from "@/app/hooks/useBreeds"

// Sample animal data
const animalData = {
  id: 1,
  name: "Daisy",
  breed: "Holstein",
  birthDate: new Date("2021-04-15"),
  weight: 450,
  notes:
    "Daisy is a healthy cow with good milk production. She has been vaccinated according to schedule and has no health issues.",
}

export default function EditAnimalPage({ params }) {
  const router = useRouter()
  const { data: animal, isLoading: isLoadingAnimal } = useAnimalDetail(params.id)
  const { data: breeds, isLoading: isLoadingBreeds } = useBreeds()
  const editAnimal = useEditAnimal(params.id)

  const [formData, setFormData] = useState({
    name: "",
    breedId: "",
    birthDate: null,
    sex: "",
    weight: "",
    healthStatus: "",
    notes: "",
  })
  const [errors, setErrors] = useState({})

  // Populate form when animal data is loaded
  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name,
        breedId: breeds?.find(b => b.name === animal.breed)?.id.toString() || "",
        birthDate: new Date(animal.birthDate),
        sex: animal.sex,
        weight: animal.healthHistory[0]?.weight?.toString() || "",
        healthStatus: animal.currentStatus,
        notes: animal.healthHistory[0]?.notes || "",
      })
    }
  }, [animal, breeds])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
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
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.breedId) newErrors.breedId = "Breed is required"
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required"
    if (!formData.sex) newErrors.sex = "Sex is required"
    if (formData.weight && (isNaN(formData.weight) || Number(formData.weight) <= 0)) {
      newErrors.weight = "Weight must be a positive number"
    }
    if (!formData.healthStatus) newErrors.healthStatus = "Health status is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await editAnimal.mutateAsync(formData)
      router.push(`/animals/${params.id}`)
    } catch (error) {
      console.error("Failed to update animal:", error)
    }
  }

  if (isLoadingAnimal || isLoadingBreeds) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/animals/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Animal</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Animal Information</CardTitle>
            <CardDescription>Update the details for {animal?.name}</CardDescription>
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
                <Select
                  value={formData.breedId}
                  onValueChange={(value) => handleSelectChange("breedId", value)}
                >
                  <SelectTrigger
                    id="breed"
                    aria-invalid={errors.breedId ? "true" : "false"}
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
                {errors.breedId && (
                  <p className="text-sm text-destructive">{errors.breedId}</p>
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
                <Label htmlFor="sex">
                  Sex <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => handleSelectChange("sex", value)}
                >
                  <SelectTrigger
                    id="sex"
                    aria-invalid={errors.sex ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && (
                  <p className="text-sm text-destructive">{errors.sex}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="healthStatus">
                  Health Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.healthStatus}
                  onValueChange={(value) => handleSelectChange("healthStatus", value)}
                >
                  <SelectTrigger
                    id="healthStatus"
                    aria-invalid={errors.healthStatus ? "true" : "false"}
                  >
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEALTHY">Healthy</SelectItem>
                    <SelectItem value="SICK">Sick</SelectItem>
                    <SelectItem value="QUARANTINED">Quarantined</SelectItem>
                  </SelectContent>
                </Select>
                {errors.healthStatus && (
                  <p className="text-sm text-destructive">{errors.healthStatus}</p>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/animals/${params.id}`}>Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={editAnimal.isPending}
            >
              {editAnimal.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
