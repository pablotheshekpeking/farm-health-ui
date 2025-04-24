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

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(session.user.id)
      },
      include: {
        farms: true,
        preferences: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(session.user.id)
      },
      data: {
        name: data.name,
        farms: {
          update: {
            where: { id: data.farmId },
            data: { name: data.farmName }
          }
        }
      },
      include: {
        farms: true,
        preferences: true
      }
    })

    const { password, ...safeUser } = updatedUser

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 