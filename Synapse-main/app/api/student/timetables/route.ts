import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getPublishedTimetables } from "@/lib/db/timetables"

export async function GET() {
  try {
    await requireRole("student")
    const timetables = await getPublishedTimetables()
    return NextResponse.json(timetables)
  } catch (error) {
    console.error("[v0] Get student timetables error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
