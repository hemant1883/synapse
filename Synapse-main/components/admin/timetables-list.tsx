"use client"

import type { Timetable } from "@/lib/models/timetable"
import { Button } from "@/components/ui/button"
import { Eye, Trash2, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

interface TimetablesListProps {
  timetables: Timetable[]
  isLoading: boolean
  onUpdate: () => void
}

export function TimetablesList({ timetables, isLoading, onUpdate }: TimetablesListProps) {
  async function handleDelete(timetableId: string) {
    if (!confirm("Are you sure you want to delete this timetable?")) return

    try {
      await fetch(`/api/timetables/${timetableId}`, { method: "DELETE" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to delete timetable:", error)
    }
  }

  async function handlePublish(timetableId: string) {
    try {
      await fetch(`/api/timetables/${timetableId}/publish`, { method: "POST" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to publish timetable:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading timetables...</div>
  }

  if (timetables.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No timetables found. Generate your first timetable to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {timetables.map((timetable) => (
        <div key={timetable.timetableId} className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                timetable.status === "published" ? "bg-success/10" : "bg-warning/10"
              }`}
            >
              {timetable.status === "published" ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <Clock className="h-5 w-5 text-warning" />
              )}
            </div>
            <div className="flex gap-1">
              <Link href={`/admin/timetables/${timetable.timetableId}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(timetable.timetableId)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h3 className="text-lg font-semibold">{timetable.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {timetable.academicYear} - {timetable.semester}
          </p>
          <p className="mt-2 text-sm text-muted-foreground capitalize">{timetable.status}</p>
          <p className="mt-1 text-xs text-muted-foreground">{timetable.slots.length} time slots</p>

          {timetable.status === "draft" && (
            <Button className="mt-4 w-full" size="sm" onClick={() => handlePublish(timetable.timetableId)}>
              Publish Timetable
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
