import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { AttendanceMarking } from "@/components/teacher/attendance-marking"

export default async function TeacherAttendancePage() {
  try {
    await requireRole("teacher")
  } catch {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />
      <div className="flex-1">
        <TeacherHeader />
        <main className="p-6 lg:p-8">
          <AttendanceMarking />
        </main>
      </div>
    </div>
  )
}
