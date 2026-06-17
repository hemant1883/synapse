import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getTimetableById, deleteTimetable } from "@/lib/db/timetables"

export async function GET(request: Request, { params }: { params: Promise<{ timetableId: string }> }) {
  try {
    await requireRole(["admin", "teacher", "student"])
    const { timetableId } = await params
    const timetable = await getTimetableById(timetableId)

    if (!timetable) {
      return NextResponse.json({ error: "Timetable not found" }, { status: 404 })
    }

    return NextResponse.json(timetable)
  } catch (error) {
    console.error("[v0] Get timetable error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ timetableId: string }> }) {
  try {
    await requireRole("admin")
    const { timetableId } = await params
    await deleteTimetable(timetableId)
    return NextResponse.json({ message: "Timetable deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete timetable error:", error)
    return NextResponse.json({ error: "Failed to delete timetable" }, { status: 500 })
  }
}
