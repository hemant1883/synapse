"use client"

import { useState, useEffect } from "react"
import type { Timetable } from "@/lib/models/timetable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export function StudentTimetableView() {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [selectedTimetable, setSelectedTimetable] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimetables()
  }, [])

  async function fetchTimetables() {
    try {
      const response = await fetch("/api/student/timetable")
      const data = await response.json()
      setTimetables(data)

      if (data.length > 0) {
        setSelectedTimetable(data[0].timetableId)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch timetables:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (timetables.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No published timetables available yet.</p>
      </div>
    )
  }

  const currentTimetable = timetables.find((t) => t.timetableId === selectedTimetable)
  const classSlots = currentTimetable?.slots || []
  const periods = Array.from(new Set(classSlots.map((s) => s.period))).sort((a, b) => a - b)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
          <p className="mt-2 text-muted-foreground">View your class schedule for the week</p>
        </div>
        {timetables.length > 1 && (
          <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a timetable" />
            </SelectTrigger>
            <SelectContent>
              {timetables.map((timetable) => (
                <SelectItem key={timetable.timetableId} value={timetable.timetableId}>
                  {timetable.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {classSlots.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">You are not assigned to any class yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border bg-muted p-3 text-left font-semibold">Period</th>
                {DAYS.slice(0, currentTimetable?.constraints.daysPerWeek || 5).map((day) => (
                  <th key={day} className="border border-border bg-muted p-3 text-left font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const periodSlots = classSlots.filter((s) => s.period === period)
                const firstSlot = periodSlots[0]

                return (
                  <tr key={period}>
                    <td className="border border-border bg-card p-3">
                      <div className="font-medium">Period {period}</div>
                      <div className="text-xs text-muted-foreground">
                        {firstSlot?.startTime} - {firstSlot?.endTime}
                      </div>
                    </td>
                    {DAYS.slice(0, currentTimetable?.constraints.daysPerWeek || 5).map((day) => {
                      const slot = periodSlots.find((s) => s.day === day)

                      if (!slot) {
                        return (
                          <td key={day} className="border border-border bg-card p-3">
                            <div className="text-sm text-muted-foreground">-</div>
                          </td>
                        )
                      }

                      if (slot.isRecess) {
                        return (
                          <td key={day} className="border border-border bg-accent/50 p-3">
                            <div className="font-medium">Recess</div>
                          </td>
                        )
                      }

                      return (
                        <td key={day} className="border border-border bg-card p-3">
                          <div className="font-medium">{slot.subjectName}</div>
                          <div className="text-xs text-muted-foreground">{slot.teacherName}</div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
