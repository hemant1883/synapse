import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { createClass, getAllClasses, getClassesBySubjectIds } from "@/lib/db/classes"
import { getSubjectsByTeacher } from "@/lib/db/subjects"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forRegistration = searchParams.get("forRegistration") === "true"

    if (forRegistration) {
        const classes = await getAllClasses()
        return NextResponse.json(classes)
    }

    const session = await requireRole(["admin", "teacher"])

    let classes = []
    if (session.role === "teacher") {
        // Teacher sees classes linked to their subjects
        const subjects = await getSubjectsByTeacher(session.userId)
        const subjectIds = subjects.map(s => s.subjectId)
        classes = await getClassesBySubjectIds(subjectIds)
    } else {
        classes = await getAllClasses()
    }

    return NextResponse.json(classes)
  } catch (error) {
    console.error("[v0] Get classes error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    await requireRole("admin")
    const data = await request.json()
    await createClass(data)
    return NextResponse.json({ message: "Class created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create class error:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
