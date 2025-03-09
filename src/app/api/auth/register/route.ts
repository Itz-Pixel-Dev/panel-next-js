import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if username or email already exists
    const existingUser = await db.users.findFirst({
      where: {
        OR: [
          { username: name },
          { email }
        ]
      }
    })

    if (existingUser) {
      // Determine which field caused the conflict
      if (existingUser.username === name) {
        return NextResponse.json(
          { message: "Username already taken. Please choose a different username." },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          { message: "Email already registered. Please use a different email or try logging in." },
          { status: 409 }
        )
      }
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await db.users.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        isAdmin: false,
        description: "No About Me"
      },
    })

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      }
    }, { status: 201 })

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      // P2002 is Prisma's error code for unique constraint violations
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] || []
        
        if (target.includes('username')) {
          return NextResponse.json(
            { message: "Username already taken. Please choose a different username." },
            { status: 409 }
          )
        } else if (target.includes('email')) {
          return NextResponse.json(
            { message: "Email already registered. Please use a different email or try logging in." },
            { status: 409 }
          )
        } else {
          return NextResponse.json(
            { message: "This user already exists." },
            { status: 409 }
          )
        }
      }
    }

    // Log the error for debugging
    console.error("Registration error:", error)

    // Return a generic error message
    return NextResponse.json(
      { message: "Something went wrong while creating your account" },
      { status: 500 }
    )
  }
} 