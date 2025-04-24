import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Get user's farm
    const userFarm = await prisma.farm.findFirst({
      where: {
        ownerId: parseInt(session.user.id)
      }
    })

    if (!userFarm) {
      return NextResponse.json({ error: "No farm found" }, { status: 404 })
    }

    // Create the animal with its first health record
    const animal = await prisma.animal.create({
      data: {
        name: data.name,
        birthDate: new Date(data.birthDate),
        sex: data.sex || "FEMALE", // Default to FEMALE if not specified
        farmId: userFarm.id,
        breedId: parseInt(data.breedId),
        healthRecords: {
          create: {
            status: "HEALTHY", // Default status for new animals
            weight: parseFloat(data.weight),
            notes: data.notes || undefined,
            date: new Date(),
          }
        }
      },
      include: {
        breed: true,
        healthRecords: true
      }
    })

    return NextResponse.json(animal)
  } catch (error) {
    console.error("Error creating animal:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const breedId = searchParams.get("breedId")
    const healthStatus = searchParams.get("healthStatus")

    // Get user's farm
    const userFarm = await prisma.farm.findFirst({
      where: {
        ownerId: parseInt(session.user.id)
      }
    })

    if (!userFarm) {
      return NextResponse.json({ error: "No farm found" }, { status: 404 })
    }

    // Build the where clause for filtering
    const where = {
      farmId: userFarm.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { breed: { name: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(breedId && breedId !== "all" && { breedId: parseInt(breedId) })
    }

    // If health status filter is active, first get the animals with their latest health record
    let filteredAnimalIds = []
    if (healthStatus && healthStatus !== "all") {
      const animalsWithLatestHealth = await prisma.animal.findMany({
        where: {
          farmId: userFarm.id,
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

      // Filter animals based on their latest health status
      filteredAnimalIds = animalsWithLatestHealth
        .filter(animal => 
          animal.healthRecords[0]?.status === healthStatus || 
          (healthStatus === "HEALTHY" && animal.healthRecords.length === 0) // Consider animals with no health records as healthy
        )
        .map(animal => animal.id)

      // Add the filtered IDs to the where clause
      where.id = { in: filteredAnimalIds }
    }

    // Get total count for pagination
    const total = await prisma.animal.count({ where })

    // Get paginated animals with their relationships
    const animals = await prisma.animal.findMany({
      where,
      include: {
        breed: true,
        healthRecords: {
          orderBy: { date: 'desc' },
          take: 1,
        }
      },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Calculate age and format the response
    const formattedAnimals = animals.map(animal => {
      const ageInMonths = Math.floor(
        (new Date() - new Date(animal.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)
      )
      
      return {
        id: animal.id,
        name: animal.name,
        breed: animal.breed.name,
        age: ageInMonths,
        status: animal.healthRecords[0]?.status || 'HEALTHY',
        birthDate: animal.birthDate,
        sex: animal.sex,
      }
    })

    return NextResponse.json({
      animals: formattedAnimals,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      }
    })
  } catch (error) {
    console.error("Error fetching animals:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 