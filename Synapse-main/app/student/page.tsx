import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/student/student-dashboard"

export default async function StudentPage() {
  try {
    await requireRole("student")
  } catch {
    redirect("/login")
  }

  return <StudentDashboard />
}
