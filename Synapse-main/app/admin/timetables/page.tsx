import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TimetablesManager } from "@/components/admin/timetables-manager"

export default async function TimetablesPage() {
  try {
    await requireRole("admin")
  } catch {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 lg:p-8">
          <TimetablesManager />
        </main>
      </div>
    </div>
  )
}
