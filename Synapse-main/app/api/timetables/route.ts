import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllTimetables } from "@/lib/db/timetables"

export async function GET() {
  try {
    await requireRole("admin")
    const timetables = await getAllTimetables()
    return NextResponse.json(timetables)
  } catch (error) {
    console.error("[v0] Get timetables error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
