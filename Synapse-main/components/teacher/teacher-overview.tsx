"use client"

import { useEffect, useState } from "react"
import { Calendar, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TeacherOverview() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalClasses: 0,
    weeklyPeriods: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch("/api/teacher/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-muted-foreground">View your schedule and manage your subjects</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">My Subjects</p>
            <p className="mt-2 text-3xl font-bold">{stats.totalSubjects}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Classes Teaching</p>
            <p className="mt-2 text-3xl font-bold">{stats.totalClasses}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Clock className="h-6 w-6 text-success" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Weekly Periods</p>
            <p className="mt-2 text-3xl font-bold">{stats.weeklyPeriods}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/teacher/timetable">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              View My Timetable
            </Button>
          </Link>
          <Link href="/teacher/subjects">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              View My Subjects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
