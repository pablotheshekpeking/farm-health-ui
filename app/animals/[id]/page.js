"use client"

import { useAnimalDetail } from "@/app/hooks/useAnimalDetail"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Pencil, Trash2, Calendar, Scale, Activity, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function AnimalDetailPage({ params }) {
  const router = useRouter()
  const { data: animal, isLoading, error } = useAnimalDetail(params.id)

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "healthy":
        return "success"
      case "sick":
        return "destructive"
      case "quarantined":
        return "warning"
      default:
        return "outline"
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "routine":
        return <CheckCircle2 className="h-5 w-5 text-primary" />
      case "issue":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading animal data...</p>
        </div>
      </div>
    )
  }

  if (error || !animal) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-xl font-semibold">Animal Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The animal you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-4">
              <Link href="/animals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Animals
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/animals">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{animal.name}</h1>
            <p className="text-muted-foreground">
              {animal.breed} • {animal.age} months old
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/animals/${animal.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Animal Details</CardTitle>
            <CardDescription>Basic information and health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(animal.currentStatus)}>
                    {animal.currentStatus.toLowerCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="mt-1 font-mono text-sm">#{animal.id.toString().padStart(4, "0")}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Birth Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(animal.birthDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Scale className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Latest Weight</p>
                  <p className="text-sm text-muted-foreground">
                    {animal.healthHistory[0]?.weight ? `${animal.healthHistory[0].weight} kg` : 'Not recorded'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium">Latest Notes</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {animal.healthHistory[0]?.notes || 'No notes available'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
            <CardDescription>Timeline of health events and treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4">
              {animal.healthHistory.map((record) => (
                <div key={record.id} className="flex gap-4">
                  <div className="relative flex h-full w-6 items-center justify-center">
                    <div className="absolute h-full w-px bg-border" />
                    <div className="relative z-10 rounded-full">
                      {getEventIcon(record.type)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 pb-4">
                    <p className="text-sm font-medium">Health Check</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm">
                      Status: {record.status.toLowerCase()}
                      {record.weight && ` • Weight: ${record.weight}kg`}
                    </p>
                    {record.notes && <p className="mt-1 text-sm">{record.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Full Medical History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
