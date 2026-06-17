import { requireRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TimetableView } from "@/components/timetable/timetable-view"

export default async function TimetableDetailPage({ params }: { params: Promise<{ timetableId: string }> }) {
  try {
    await requireRole("admin")
  } catch {
    redirect("/login")
  }

  const { timetableId } = await params

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6 lg:p-8">
          <TimetableView timetableId={timetableId} />
        </main>
      </div>
    </div>
  )
}
