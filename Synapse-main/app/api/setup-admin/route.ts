import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { createUser, getUserByEmail } from "@/lib/db/users"

export async function GET() {
  try {
    await getDatabase()

    // Check if admin already exists
    const existingAdmin = await getUserByEmail("admin@timetable.com")
    if (existingAdmin) {
      return NextResponse.json(
        {
          error: "Admin user already exists",
          message: "You can login with email: admin@timetable.com",
        },
        { status: 400 },
      )
    }

    // Create admin user with default credentials
    const adminUser = await createUser({
      email: "admin@timetable.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "admin@timetable.com",
        note: "Password is: admin123",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating admin:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    await getDatabase()

    const { email, password, name } = await request.json()

    // Check if admin already exists
    const existingAdmin = await getUserByEmail(email || "admin@timetable.com")
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 400 })
    }

    // Create admin user
    const adminUser = await createUser({
      email: email || "admin@timetable.com",
      password: password || "admin123",
      name: name || "Admin User",
      role: "admin",
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "admin@timetable.com",
        password: "Use the password you provided",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating admin:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
