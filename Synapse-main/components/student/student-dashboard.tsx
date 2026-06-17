import { StudentHeader } from "@/components/student/student-header"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { StudentOverview } from "@/components/student/student-overview"

export function StudentDashboard() {
  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentHeader />
        <main className="p-6 lg:p-8">
          <StudentOverview />
        </main>
      </div>
    </div>
  )
}
