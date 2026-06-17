import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateAttendance } from "@/lib/db/attendance"

export async function PUT(request: Request) {
  try {
    await requireRole(["teacher", "admin"])
    const data = await request.json()
    const { attendanceId,records } = data

    if (!attendanceId || !records) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await updateAttendance(attendanceId, records)

    return NextResponse.json({ success: true, message: "Attendance updated successfully" })
  } catch (error) {
    console.error("[v0] Update attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
