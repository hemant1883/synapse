import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getPublishedTimetables } from "@/lib/db/timetables"
import { getClassById } from "@/lib/db/classes"

export async function GET() {
  try {
    const session = await requireRole("student")

    console.log("[v0] Student stats request for user:", session.userId, "classId:", session.classId)

    let className = "Not Assigned"
    let totalSubjects = 0
    let weeklyPeriods = 0

    if (session.classId) {
      // Get class details
      const classData = await getClassById(session.classId)
      if (classData) {
        className = classData.name
        totalSubjects = classData.subjects?.length || 0
      }

      // Get published timetables and count periods
      const timetables = await getPublishedTimetables()
      if (timetables.length > 0) {
        const latestTimetable = timetables[0]
        const classSlots = latestTimetable.slots.filter((s) => s.classId === session.classId && !s.isRecess)
        weeklyPeriods = classSlots.length
      }
    }

    console.log("[v0] Student stats:", { className, totalSubjects, weeklyPeriods })

    return NextResponse.json({
      className,
      totalSubjects,
      weeklyPeriods,
    })
  } catch (error) {
    console.error("[v0] Get student stats error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
