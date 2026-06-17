import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateClass, deleteClass } from "@/lib/db/classes"

export async function PUT(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    await requireRole("admin")
    const { classId } = await params
    const data = await request.json()
    await updateClass(classId, data)
    return NextResponse.json({ message: "Class updated successfully" })
  } catch (error) {
    console.error("[v0] Update class error:", error)
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  try {
    await requireRole("admin")
    const { classId } = await params
    await deleteClass(classId)
    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete class error:", error)
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
  }
}
