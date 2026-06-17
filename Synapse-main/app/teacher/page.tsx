import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"

export default async function TeacherPage() {
  try {
    await requireRole("teacher")
  } catch {
    redirect("/login")
  }

  return <TeacherDashboard />
}
