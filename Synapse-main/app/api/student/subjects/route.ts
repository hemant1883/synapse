import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllSubjects } from "@/lib/db/subjects"
import { getClassById } from "@/lib/db/classes"

export async function GET() {
  try {
    const session = await requireRole("student")

    if (!session.classId) {
      return NextResponse.json([])
    }

    const classData = await getClassById(session.classId)

    if (!classData) {
      return NextResponse.json([])
    }

    const allSubjects = await getAllSubjects()
    const classSubjects = allSubjects.filter((s) => classData.subjects.includes(s.subjectId))

    return NextResponse.json(classSubjects)
  } catch (error) {
    console.error("[v0] Get student subjects error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
