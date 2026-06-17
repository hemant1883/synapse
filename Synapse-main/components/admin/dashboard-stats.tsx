"use client"

import { Calendar, BookOpen, GraduationCap, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  activeTimetables: number
  totalSubjects: number
  totalClasses: number
  totalUsers: number
  recentUsers: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6 animate-pulse">
            <div className="flex h-12 w-12 rounded-lg bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
        Failed to load statistics
      </div>
    )
  }

  const statCards = [
    {
      name: "Active Timetables",
      value: stats.activeTimetables.toString(),
      icon: Calendar,
      change: stats.activeTimetables > 0 ? "Currently active" : "No active timetables",
      changeType: stats.activeTimetables > 0 ? ("positive" as const) : ("neutral" as const),
    },
    {
      name: "Total Subjects",
      value: stats.totalSubjects.toString(),
      icon: BookOpen,
      change: `${stats.totalSubjects} subjects available`,
      changeType: "neutral" as const,
    },
    {
      name: "Classes",
      value: stats.totalClasses.toString(),
      icon: GraduationCap,
      change: `${stats.totalClasses} classes registered`,
      changeType: "neutral" as const,
    },
    {
      name: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      change: stats.recentUsers > 0 ? `+${stats.recentUsers} this week` : "No new users",
      changeType: stats.recentUsers > 0 ? ("positive" as const) : ("neutral" as const),
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
