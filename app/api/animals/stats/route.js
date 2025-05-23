import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's farm
    const userFarm = await prisma.farm.findFirst({
      where: {
        ownerId: parseInt(session.user.id)
      }
    })

    if (!userFarm) {
      return NextResponse.json({ error: "No farm found" }, { status: 404 })
    }

    // Get all animals for the farm with their health records
    const animals = await prisma.animal.findMany({
      where: {
        farmId: userFarm.id
      },
      include: {
        healthRecords: {
          orderBy: {
            date: 'desc'
          },
          take: 1,
        }
      }
    })

    // Calculate statistics
    const totalAnimals = animals.length
    const now = new Date()

    // Calculate age for each animal and create age distribution
    const ageGroups = {
      "0-6 months": 0,
      "7-12 months": 0,
      "13-24 months": 0,
      "25-36 months": 0,
      "37+ months": 0
    }

    const ages = animals.map(animal => {
      const birthDate = new Date(animal.birthDate)
      const ageInMonths = (now - birthDate) / (1000 * 60 * 60 * 24 * 30.44) // Approximate months
      
      // Increment the appropriate age group counter
      if (ageInMonths <= 6) {
        ageGroups["0-6 months"]++
      } else if (ageInMonths <= 12) {
        ageGroups["7-12 months"]++
      } else if (ageInMonths <= 24) {
        ageGroups["13-24 months"]++
      } else if (ageInMonths <= 36) {
        ageGroups["25-36 months"]++
      } else {
        ageGroups["37+ months"]++
      }
      
      return ageInMonths
    })

    // Convert age groups to the format expected by the chart
    const ageDistribution = Object.entries(ageGroups).map(([name, count]) => ({
      name,
      count
    }))
    
    const averageAge = ages.length 
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) 
      : 0

    const weights = animals
      .map(animal => animal.healthRecords[0]?.weight)
      .filter(weight => weight !== null && weight !== undefined)
    
    const averageWeight = weights.length 
      ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) 
      : 0

    const healthAlerts = animals.filter(animal => 
      animal.healthRecords[0]?.status === "SICK" || 
      animal.healthRecords[0]?.status === "QUARANTINED"
    ).length

    // Get previous month's stats for comparison
    const nowDate = new Date()
    const startOfThisMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)
    const startOfPrevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1)
    const endOfPrevMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 0)

    const prevAnimals = await prisma.animal.findMany({
      where: {
        farmId: userFarm.id,
        createdAt: { lte: endOfPrevMonth },
      },
      include: {
        healthRecords: {
          where: { date: { lte: endOfPrevMonth } },
          orderBy: { date: 'desc' },
          take: 1,
        }
      }
    })

    const prevTotalAnimals = prevAnimals.length

    const prevAges = prevAnimals.map(animal => {
      const birthDate = new Date(animal.birthDate)
      return (endOfPrevMonth - birthDate) / (1000 * 60 * 60 * 24 * 30.44)
    })
    const prevAverageAge = prevAges.length
      ? Math.round(prevAges.reduce((a, b) => a + b, 0) / prevAges.length)
      : 0

    const prevWeights = prevAnimals
      .map(animal => animal.healthRecords[0]?.weight)
      .filter(weight => weight !== null && weight !== undefined)
    const prevAverageWeight = prevWeights.length
      ? Math.round(prevWeights.reduce((a, b) => a + b, 0) / prevWeights.length)
      : 0

    const prevHealthAlerts = prevAnimals.filter(animal =>
      animal.healthRecords[0]?.status === "SICK" ||
      animal.healthRecords[0]?.status === "QUARANTINED"
    ).length

    const delta = (current, prev, unit = "") => {
      const diff = current - prev
      return `${diff > 0 ? "+" : ""}${diff}${unit}`
    }

    return NextResponse.json({
      currentStats: {
        totalAnimals,
        averageAge,
        averageWeight,
        healthAlerts,
        ageDistribution
      },
      changes: {
        animals: delta(totalAnimals, prevTotalAnimals),
        age: delta(averageAge, prevAverageAge),
        weight: delta(averageWeight, prevAverageWeight),
        alerts: delta(healthAlerts, prevHealthAlerts)
      }
    })
  } catch (error) {
    console.error("Error fetching animal stats:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 