import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { TeacherSubjectsView } from "@/components/teacher/teacher-subjects-view"

export default async function TeacherSubjectsPage() {
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
          <TeacherSubjectsView />
        </main>
      </div>
    </div>
  )
}
