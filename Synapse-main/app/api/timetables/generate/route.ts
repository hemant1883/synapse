import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { createTimetable } from "@/lib/db/timetables"
import { getAllClasses } from "@/lib/db/classes"
import { getAllSubjects } from "@/lib/db/subjects"
import { TimetableGenerator } from "@/lib/timetable-generator"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    await requireRole("admin")
    const data = await request.json()

    // Fetch classes and subjects
    const classes = await getAllClasses()
    const subjects = await getAllSubjects()

    if (classes.length === 0) {
      return NextResponse.json({ error: "No classes found. Please create classes first." }, { status: 400 })
    }

    if (subjects.length === 0) {
      return NextResponse.json({ error: "No subjects found. Please create subjects first." }, { status: 400 })
    }

    // Generate timetable
    const generator = new TimetableGenerator(data.constraints, classes, subjects)
    const result = generator.generate()

    if (!result.success) {
      return NextResponse.json({ error: "Failed to generate timetable", details: result.errors }, { status: 400 })
    }

    // Save timetable
    const timetableId = nanoid()
    await createTimetable({
      timetableId,
      name: data.name,
      academicYear: data.academicYear,
      semester: data.semester,
      constraints: data.constraints,
      slots: result.slots,
      status: "draft",
    })

    return NextResponse.json({ message: "Timetable generated successfully", timetableId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Generate timetable error:", error)
    return NextResponse.json({ error: "Failed to generate timetable" }, { status: 500 })
  }
}
