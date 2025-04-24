"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { PawPrint, AlertTriangle, Scale, Calendar } from "lucide-react"
import { useAnimalStats } from "../hooks/useAnimalStats"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useBreedDistribution } from "@/app/hooks/useBreedDistribution"

// Sample data for charts
const breedDistribution = [
  { name: "Cattle", value: 45 },
  { name: "Sheep", value: 25 },
  { name: "Goat", value: 15 },
  { name: "Pig", value: 10 },
  { name: "Chicken", value: 5 },
]

const healthAlerts = [
  { id: 1, animal: "Daisy (Cow #1234)", issue: "Missed vaccination", priority: "high", date: "2023-04-15" },
  { id: 2, animal: "Sheep Group A", issue: "Weight below target", priority: "medium", date: "2023-04-14" },
  { id: 3, animal: "Goat #789", issue: "Abnormal behavior", priority: "high", date: "2023-04-13" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

function BreedDistributionChart() {
  const { data: breedDistribution, isLoading, error } = useBreedDistribution()

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-destructive">
        Error loading breed distribution
      </div>
    )
  }

  if (!breedDistribution?.length) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No breed data available
      </div>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <PieChart width={400} height={300}>
        <Pie
          data={breedDistribution}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
        >
          {breedDistribution.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value} animals`, name]}
        />
        <Legend />
      </PieChart>
    </div>
  )
}

export default function DashboardPage() {
  const { data: animalStats, isLoading, error } = useAnimalStats()

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your farm health and livestock status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Calendar className="mr-1 h-3 w-3" />
            Last updated: {new Date().toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{animalStats.currentStats.totalAnimals}</div>
                <p className="text-xs text-muted-foreground">{animalStats.changes.animals} from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{animalStats.currentStats.averageAge} months</div>
                <p className="text-xs text-muted-foreground">{animalStats.changes.age} months from last check</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{animalStats.currentStats.averageWeight} kg</div>
                <p className="text-xs text-muted-foreground">{animalStats.changes.weight} kg from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{animalStats.currentStats.healthAlerts}</div>
                <p className="text-xs text-muted-foreground">{animalStats.changes.alerts} from last week</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/*<TabsTrigger value="alerts">Health Alerts</TabsTrigger>*/}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Breed Distribution</CardTitle>
                <CardDescription>
                  Distribution of animals by breed in your farm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BreedDistributionChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Number of animals by age group</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animalStats.currentStats.ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          {healthAlerts.map((alert) => (
            <Alert key={alert.id} variant={alert.priority === "high" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {alert.animal}
                <Badge variant={alert.priority === "high" ? "destructive" : "outline"}>{alert.priority}</Badge>
              </AlertTitle>
              <AlertDescription className="flex justify-between">
                <span>{alert.issue}</span>
                <span className="text-xs text-muted-foreground">Reported: {alert.date}</span>
              </AlertDescription>
            </Alert>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
