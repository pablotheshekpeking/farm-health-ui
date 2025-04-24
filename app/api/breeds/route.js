import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const breeds = await prisma.breed.findMany()

    // Sort breeds with "Other" always at the end
    const sortedBreeds = breeds.sort((a, b) => {
      // If either breed is "Other", handle specially
      if (a.name === "Other") return 1  // Move "Other" to end
      if (b.name === "Other") return -1 // Move "Other" to end
      
      // For all other breeds, sort alphabetically
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(sortedBreeds)
  } catch (error) {
    console.error("Error fetching breeds:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 