import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { TeacherTimetableView } from "@/components/teacher/teacher-timetable-view"

export default async function TeacherTimetablePage() {
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
          <TeacherTimetableView />
        </main>
      </div>
    </div>
  )
}
