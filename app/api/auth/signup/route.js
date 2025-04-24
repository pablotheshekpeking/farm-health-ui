import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { name, email, password, farmName } = await req.json()

    // Validate input
    if (!name || !email || !password || !farmName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and farm in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER',
        },
      })

      // Create farm
      const farm = await prisma.farm.create({
        data: {
          name: farmName,
          ownerId: user.id,
        },
      })

      // Create default preferences
      await prisma.preferences.create({
        data: {
          userId: user.id,
          emailAlerts: true,
          darkMode: false,
        },
      })

      return { user, farm }
    })

    // Return success without sensitive data
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    )
  }
} 