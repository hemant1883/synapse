"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, BookOpen, Users, GraduationCap, Settings, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Timetables", href: "/admin/timetables", icon: Calendar },
  { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { name: "Classes", href: "/admin/classes", icon: GraduationCap },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Calendar className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold">TimeTable Pro</span>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
