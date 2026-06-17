import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { createAttendance, checkAttendanceExists } from "@/lib/db/attendance"

export async function POST(request: Request) {
  try {
    const session = await requireRole(["teacher", "admin"])
    const data = await request.json()

    const { 
      classId, 
      className, 
      subjectId, 
      subjectName, 
      period, 
      date, 
      records,
      startTime,
      endTime
    } = data

    if (!classId || !subjectId || !period || !date || !records) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const attendanceDate = new Date(date)
    
    // Check for duplicate
    const exists = await checkAttendanceExists(classId, subjectId, attendanceDate, period)
    if (exists) {
      return NextResponse.json(
        { error: "Attendance already marked for this session" }, 
        { status: 409 }
      )
    }

    const attendanceId = await createAttendance({
      classId,
      className,
      subjectId,
      subjectName,
      teacherId: session.userId,
      teacherName: session.name,
      period,
      date: attendanceDate,
      startTime,
      endTime,
      records
    })

    return NextResponse.json({ 
      success: true, 
      attendanceId,
      message: "Attendance marked successfully" 
    }, { status: 201 })

  } catch (error) {
    console.error("[v0] Mark attendance error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" }, 
      { status: 500 }
    )
  }
}
