import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getTimetableById } from "@/lib/db/timetables"

export async function GET(request: Request, { params }: { params: Promise<{ timetableId: string }> }) {
  try {
    const session = await requireRole("teacher")
    const { timetableId } = await params

    const timetable = await getTimetableById(timetableId)

    if (!timetable) {
      return NextResponse.json({ error: "Timetable not found" }, { status: 404 })
    }

    // Filter slots for this teacher only
    const teacherSlots = timetable.slots.filter((s) => s.teacherId === session.userId || s.isRecess)

    return NextResponse.json({
      ...timetable,
      slots: teacherSlots,
    })
  } catch (error) {
    console.error("[v0] Get teacher timetable error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
