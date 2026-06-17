import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  try {
    await requireRole("admin")
  } catch {
    redirect("/login")
  }

  return <AdminDashboard />
}
