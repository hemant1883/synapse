import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateTimetable } from "@/lib/db/timetables"

export async function POST(request: Request, { params }: { params: Promise<{ timetableId: string }> }) {
  try {
    await requireRole("admin")
    const { timetableId } = await params

    await updateTimetable(timetableId, {
      status: "published",
      generatedAt: new Date(),
    })

    return NextResponse.json({ message: "Timetable published successfully" })
  } catch (error) {
    console.error("[v0] Publish timetable error:", error)
    return NextResponse.json({ error: "Failed to publish timetable" }, { status: 500 })
  }
}
