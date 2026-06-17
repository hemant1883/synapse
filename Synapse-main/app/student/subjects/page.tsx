import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StudentHeader } from "@/components/student/student-header"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { StudentSubjectsView } from "@/components/student/student-subjects-view"

export default async function StudentSubjectsPage() {
  try {
    await requireRole("student")
  } catch {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentHeader />
        <main className="p-6 lg:p-8">
          <StudentSubjectsView />
        </main>
      </div>
    </div>
  )
}
