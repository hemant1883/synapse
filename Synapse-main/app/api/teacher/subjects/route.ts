import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllSubjects } from "@/lib/db/subjects"

export async function GET() {
  try {
    const session = await requireRole("teacher")
    const allSubjects = await getAllSubjects()
    const teacherSubjects = allSubjects.filter((s) => s.teacherId === session.userId)

    return NextResponse.json(teacherSubjects)
  } catch (error) {
    console.error("[v0] Get teacher subjects error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
