import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const animalId = parseInt(params.id)

    // Get user's farm
    const userFarm = await prisma.farm.findFirst({
      where: {
        ownerId: parseInt(session.user.id)
      }
    })

    if (!userFarm) {
      return NextResponse.json({ error: "No farm found" }, { status: 404 })
    }

    // Fetch the animal with all its related data
    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        farmId: userFarm.id // Ensure the animal belongs to the user's farm
      },
      include: {
        breed: true,
        healthRecords: {
          orderBy: {
            date: 'desc'
          },
          include: {
            // Include any additional relations if needed
          }
        }
      }
    })

    if (!animal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 })
    }

    // Calculate age in months
    const ageInMonths = Math.floor(
      (new Date() - new Date(animal.birthDate)) / (1000 * 60 * 60 * 24 * 30.44)
    )

    // Format the response
    const formattedAnimal = {
      id: animal.id,
      name: animal.name,
      breed: animal.breed.name,
      birthDate: animal.birthDate,
      sex: animal.sex,
      age: ageInMonths,
      currentStatus: animal.healthRecords[0]?.status || 'HEALTHY',
      healthHistory: animal.healthRecords.map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        weight: record.weight,
        notes: record.notes,
        type: record.status === 'HEALTHY' ? 'routine' : 'issue'
      }))
    }

    return NextResponse.json(formattedAnimal)
  } catch (error) {
    console.error("Error fetching animal details:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const animalId = parseInt(params.id)
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

    // Verify animal belongs to user's farm
    const existingAnimal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        farmId: userFarm.id
      }
    })

    if (!existingAnimal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 })
    }

    // Update animal
    const updatedAnimal = await prisma.animal.update({
      where: {
        id: animalId
      },
      data: {
        name: data.name,
        birthDate: new Date(data.birthDate),
        breedId: parseInt(data.breedId),
        sex: data.sex,
      }
    })

    // If health status or weight has changed, create a new health record
    if (data.healthStatus || data.weight) {
      await prisma.healthRecord.create({
        data: {
          animalId: animalId,
          status: data.healthStatus,
          weight: data.weight ? parseFloat(data.weight) : null,
          notes: data.notes
        }
      })
    }

    return NextResponse.json(updatedAnimal)
  } catch (error) {
    console.error("Error updating animal:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}