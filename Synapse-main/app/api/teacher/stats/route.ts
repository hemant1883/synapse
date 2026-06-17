import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllSubjects } from "@/lib/db/subjects"
import { getPublishedTimetables } from "@/lib/db/timetables"

export async function GET() {
  try {
    const session = await requireRole("teacher")

    // Get teacher's subjects
    const allSubjects = await getAllSubjects()
    const teacherSubjects = allSubjects.filter((s) => s.teacherId === session.userId)

    // Get published timetables and count teacher's periods
    const timetables = await getPublishedTimetables()
    let weeklyPeriods = 0
    const classesSet = new Set<string>()

    if (timetables.length > 0) {
      const latestTimetable = timetables[0]
      const teacherSlots = latestTimetable.slots.filter((s) => s.teacherId === session.userId && !s.isRecess)

      weeklyPeriods = teacherSlots.length
      teacherSlots.forEach((slot) => classesSet.add(slot.classId))
    }

    return NextResponse.json({
      totalSubjects: teacherSubjects.length,
      totalClasses: classesSet.size,
      weeklyPeriods,
    })
  } catch (error) {
    console.error("[v0] Get teacher stats error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
