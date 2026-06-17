import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getAllUsers } from "@/lib/db/users"
import { getAllTimetables } from "@/lib/db/timetables"
import { getAllSubjects } from "@/lib/db/subjects"
import { getAllClasses } from "@/lib/db/classes"

export async function GET() {
  try {
    // Require admin role
    await requireRole("admin")

    // Fetch all data in parallel
    const [users, timetables, subjects, classes] = await Promise.all([
      getAllUsers(),
      getAllTimetables(),
      getAllSubjects(),
      getAllClasses(),
    ])

    // Calculate active timetables (published or draft)
    const activeTimetables = timetables.filter((t) => t.status === "published" || t.status === "draft").length

    // Calculate recent changes (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentUsers = users.filter((u) => new Date(u.createdAt) > sevenDaysAgo).length

    const stats = {
      activeTimetables,
      totalSubjects: subjects.length,
      totalClasses: classes.length,
      totalUsers: users.length,
      recentUsers,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
