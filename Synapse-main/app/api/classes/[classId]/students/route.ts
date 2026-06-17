import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getStudentsByClass } from "@/lib/db/users"

export async function GET(
  request: Request,
  { params }: { params: { classId: string } },
) {
  try {
    await requireRole(["teacher", "admin"])
    const { classId } = params

    const students = await getStudentsByClass(classId)

    return NextResponse.json(students)
  } catch (error) {
    console.error("[v0] Get class students error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
