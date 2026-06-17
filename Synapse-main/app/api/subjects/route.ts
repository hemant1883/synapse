import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { createSubject, getAllSubjects, getSubjectsByTeacher } from "@/lib/db/subjects"

export async function GET() {
  try {
    const session = await requireRole(["admin", "teacher"])
    
    let subjects = []
    if (session.role === "teacher") {
        subjects = await getSubjectsByTeacher(session.userId)
    } else {
        subjects = await getAllSubjects()
    }
    
    return NextResponse.json(subjects)
  } catch (error) {
    console.error("[v0] Get subjects error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    await requireRole("admin")
    const data = await request.json()
    await createSubject(data)
    return NextResponse.json({ message: "Subject created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create subject error:", error)
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
