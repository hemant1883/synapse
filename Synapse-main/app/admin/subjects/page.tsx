import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SubjectsManager } from "@/components/admin/subjects-manager"

export default async function SubjectsPage() {
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
          <SubjectsManager />
        </main>
      </div>
    </div>
  )
}
