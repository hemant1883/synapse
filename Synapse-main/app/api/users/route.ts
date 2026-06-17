import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllTeachers, getAllStudents } from "@/lib/db/users"

export async function GET(request: Request) {
  try {
    await requireRole("admin")
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (role === "teacher") {
      const teachers = await getAllTeachers()
      return NextResponse.json(teachers)
    }

    if (role === "student") {
      const students = await getAllStudents()
      return NextResponse.json(students)
    }

    return NextResponse.json({ error: "Invalid role parameter" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Get users error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
