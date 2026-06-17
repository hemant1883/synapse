import { NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/db/users"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const session = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      ...(user.classId && { classId: user.classId }),
    }

    await createSession(session)

    return NextResponse.json({ user: session })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
