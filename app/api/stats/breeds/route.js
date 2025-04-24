import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import { NextResponse } from "next/server"

export async function GET(req) {
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

    // Get breed distribution
    const breedDistribution = await prisma.animal.groupBy({
      by: ['breedId'],
      where: {
        farmId: userFarm.id
      },
      _count: {
        id: true
      }
    })

    // Get breed names and calculate percentages
    const totalAnimals = breedDistribution.reduce((acc, curr) => acc + curr._count.id, 0)
    
    const breedsWithNames = await Promise.all(
      breedDistribution.map(async (item) => {
        const breed = await prisma.breed.findUnique({
          where: { id: item.breedId }
        })
        return {
          name: breed.name,
          value: item._count.id,
          percentage: (item._count.id / totalAnimals) * 100
        }
      })
    )

    // Sort breeds by count, but ensure "Other" is last if it exists
    const sortedBreeds = breedsWithNames.sort((a, b) => {
      if (a.name === "Other") return 1
      if (b.name === "Other") return -1
      return b.value - a.value
    })

    return NextResponse.json(sortedBreeds)
  } catch (error) {
    console.error("Error fetching breed distribution:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 