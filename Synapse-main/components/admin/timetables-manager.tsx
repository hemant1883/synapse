"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TimetableDialog } from "@/components/admin/timetable-dialog"
import { TimetablesList } from "@/components/admin/timetables-list"
import type { Timetable } from "@/lib/models/timetable"

export function TimetablesManager() {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimetables()
  }, [])

  async function fetchTimetables() {
    try {
      const response = await fetch("/api/timetables")
      const data = await response.json()
      setTimetables(data)
    } catch (error) {
      console.error("[v0] Failed to fetch timetables:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetables</h1>
          <p className="mt-2 text-muted-foreground">Generate and manage timetables for all classes</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Timetable
        </Button>
      </div>

      <TimetablesList timetables={timetables} isLoading={isLoading} onUpdate={fetchTimetables} />
      <TimetableDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchTimetables} />
    </div>
  )
}
