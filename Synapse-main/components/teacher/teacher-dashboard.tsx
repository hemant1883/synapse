import { TeacherHeader } from "@/components/teacher/teacher-header"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { TeacherOverview } from "@/components/teacher/teacher-overview"

export function TeacherDashboard() {
  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />
      <div className="flex-1">
        <TeacherHeader />
        <main className="p-6 lg:p-8">
          <TeacherOverview />
        </main>
      </div>
    </div>
  )
}
