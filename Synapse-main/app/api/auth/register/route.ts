import { NextResponse } from "next/server"
import { createUser, getUserByEmail, getAllUsers } from "@/lib/db/users"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password, role, classId } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (role === "admin") {
      const allUsers = await getAllUsers()
      const adminExists = allUsers.some((user) => user.role === "admin")

      if (adminExists) {
        return NextResponse.json(
          { error: "An admin account already exists. Only one admin is allowed." },
          { status: 403 },
        )
      }
    }

    if (role === "student" && !classId) {
      return NextResponse.json({ error: "Class selection is required for students" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const userId = await createUser({
      name,
      email,
      password,
      role,
      ...(classId && { classId }),
    })

    const session = {
      userId,
      email,
      name,
      role,
      ...(classId && { classId }),
    }

    await createSession(session)

    return NextResponse.json({ user: session }, { status: 201 })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
