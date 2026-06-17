import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getPublishedTimetables } from "@/lib/db/timetables"

export async function GET() {
  try {
    const session = await requireRole("student")

    console.log("[v0] Fetching timetable for student:", session.userId, "classId:", session.classId)

    if (!session.classId) {
      return NextResponse.json({ error: "No class assigned to student" }, { status: 400 })
    }

    const timetables = await getPublishedTimetables()

    // Filter timetables to only include slots for the student's class
    const studentTimetables = timetables.map((timetable) => ({
      ...timetable,
      slots: timetable.slots.filter((slot) => slot.classId === session.classId),
    }))

    console.log("[v0] Found timetables:", studentTimetables.length)

    return NextResponse.json(studentTimetables)
  } catch (error) {
    console.error("[v0] Get student timetable error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
