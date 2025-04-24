"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Download, FileText, BarChart2, PawPrint, Scale } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Sample data for charts
const breedDistribution = [
  { name: "Holstein", value: 45 },
  { name: "Jersey", value: 25 },
  { name: "Angus", value: 15 },
  { name: "Hereford", value: 10 },
  { name: "Other", value: 5 },
]

const weightByBreed = [
  { name: "Holstein", weight: 650 },
  { name: "Jersey", weight: 450 },
  { name: "Angus", weight: 580 },
  { name: "Hereford", weight: 520 },
  { name: "Other", weight: 500 },
]

const ageDistribution = [
  { name: "0-6 months", count: 12 },
  { name: "7-12 months", count: 18 },
  { name: "13-24 months", count: 29 },
  { name: "25-36 months", count: 15 },
  { name: "37+ months", count: 8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [selectedBreed, setSelectedBreed] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 1000)
  }

  const handleDownloadCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert("CSV download started")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view reports about your livestock</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date range and filters to generate a custom report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex flex-col space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Breed</Label>
              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Breeds</SelectItem>
                  <SelectItem value="Holstein">Holstein</SelectItem>
                  <SelectItem value="Jersey">Jersey</SelectItem>
                  <SelectItem value="Angus">Angus</SelectItem>
                  <SelectItem value="Hereford">Hereford</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Animals</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">540 kg</div>
            <p className="text-xs text-muted-foreground">Across all breeds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Average Age</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 months</div>
            <p className="text-xs text-muted-foreground">Across all animals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Table
          </TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Breed Distribution</CardTitle>
                <CardDescription>Breakdown of animals by breed</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={breedDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {breedDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Weight by Breed</CardTitle>
                <CardDescription>Comparison of average weights across breeds</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightByBreed}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="weight" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="data">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Report Data</CardTitle>
                <CardDescription>Detailed data for the selected period</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="px-4 py-3 text-left">Breed</th>
                        <th className="px-4 py-3 text-left">Count</th>
                        <th className="px-4 py-3 text-left">Avg. Weight (kg)</th>
                        <th className="px-4 py-3 text-left">Avg. Age (months)</th>
                        <th className="px-4 py-3 text-left">Health Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3">Holstein</td>
                        <td className="px-4 py-3">45</td>
                        <td className="px-4 py-3">650</td>
                        <td className="px-4 py-3">24</td>
                        <td className="px-4 py-3">92% Healthy</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Jersey</td>
                        <td className="px-4 py-3">25</td>
                        <td className="px-4 py-3">450</td>
                        <td className="px-4 py-3">18</td>
                        <td className="px-4 py-3">88% Healthy</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Angus</td>
                        <td className="px-4 py-3">15</td>
                        <td className="px-4 py-3">580</td>
                        <td className="px-4 py-3">15</td>
                        <td className="px-4 py-3">93% Healthy</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3">Hereford</td>
                        <td className="px-4 py-3">10</td>
                        <td className="px-4 py-3">520</td>
                        <td className="px-4 py-3">12</td>
                        <td className="px-4 py-3">90% Healthy</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Other</td>
                        <td className="px-4 py-3">5</td>
                        <td className="px-4 py-3">500</td>
                        <td className="px-4 py-3">20</td>
                        <td className="px-4 py-3">85% Healthy</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Data shown is for the period {format(dateRange.from, "LLL dd, y")} to {format(dateRange.to, "LLL dd, y")}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
