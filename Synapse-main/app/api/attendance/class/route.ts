import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAttendanceByClassAndDate } from "@/lib/db/attendance"

export async function GET(request: Request) {
  try {
    await requireRole(["teacher", "admin"])
    const url = new URL(request.url)
    const classId = url.searchParams.get("classId")
    const dateParam = url.searchParams.get("date")

    if (!classId || !dateParam) {
      return NextResponse.json({ error: "Class ID and Date are required" }, { status: 400 })
    }

    const date = new Date(dateParam)
    const attendance = await getAttendanceByClassAndDate(classId, date)

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("[v0] Get class attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
