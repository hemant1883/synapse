import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { updateSubject, deleteSubject } from "@/lib/db/subjects"

export async function PUT(request: Request, { params }: { params: Promise<{ subjectId: string }> }) {
  try {
    await requireRole("admin")
    const { subjectId } = await params
    const data = await request.json()
    await updateSubject(subjectId, data)
    return NextResponse.json({ message: "Subject updated successfully" })
  } catch (error) {
    console.error("[v0] Update subject error:", error)
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ subjectId: string }> }) {
  try {
    await requireRole("admin")
    const { subjectId } = await params
    await deleteSubject(subjectId)
    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete subject error:", error)
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}
