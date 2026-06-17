import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getTimetableById } from "@/lib/db/timetables"

export async function GET(request: Request, { params }: { params: Promise<{ timetableId: string }> }) {
  try {
    const session = await requireRole("student")
    const { timetableId } = await params

    const timetable = await getTimetableById(timetableId)

    if (!timetable) {
      return NextResponse.json({ error: "Timetable not found" }, { status: 404 })
    }

    if (!session.classId) {
      return NextResponse.json({ ...timetable, slots: [] })
    }

    // Filter slots for this student's class only
    const classSlots = timetable.slots.filter((s) => s.classId === session.classId)

    return NextResponse.json({
      ...timetable,
      slots: classSlots,
    })
  } catch (error) {
    console.error("[v0] Get student timetable error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
