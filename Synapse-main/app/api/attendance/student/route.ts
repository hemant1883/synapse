import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAttendanceByStudent } from "@/lib/db/attendance"

export async function GET(request: Request) {
  try {
    const session = await requireRole("student")
    const attendanceDocs = await getAttendanceByStudent(session.userId)

    const attendance = attendanceDocs.map(doc => {
        const myRecord = doc.records.find(r => r.studentId === session.userId)
        return {
            date: doc.date,
            subjectName: doc.subjectName,
            period: doc.period,
            status: myRecord?.status || "unknown",
            teacherName: doc.teacherName
        }
    })

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("[v0] Get student attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
