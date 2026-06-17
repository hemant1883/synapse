import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getPublishedTimetables } from "@/lib/db/timetables"

export async function GET() {
  try {
    await requireRole("teacher")
    const timetables = await getPublishedTimetables()
    return NextResponse.json(timetables)
  } catch (error) {
    console.error("[v0] Get teacher timetables error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
