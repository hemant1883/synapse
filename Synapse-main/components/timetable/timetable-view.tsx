"use client"

import { useState, useEffect } from "react"
import type { Timetable } from "@/lib/models/timetable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export function TimetableView({ timetableId }: { timetableId: string }) {
  const [timetable, setTimetable] = useState<Timetable | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimetable()
  }, [timetableId])

  async function fetchTimetable() {
    try {
      const response = await fetch(`/api/timetables/${timetableId}`)
      const data = await response.json()
      setTimetable(data)

      // Set first class as default
      if (data.slots.length > 0) {
        setSelectedClass(data.slots[0].classId)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch timetable:", error)
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

  if (!timetable) {
    return <div className="text-center text-muted-foreground">Timetable not found</div>
  }

  const classes = Array.from(new Set(timetable.slots.map((s) => s.classId)))
  const classSlots = timetable.slots.filter((s) => s.classId === selectedClass)

  const periods = Array.from(new Set(classSlots.map((s) => s.period))).sort((a, b) => a - b)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{timetable.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {timetable.academicYear} - {timetable.semester}
          </p>
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classId) => {
              const slot = timetable.slots.find((s) => s.classId === classId)
              return (
                <SelectItem key={classId} value={classId}>
                  {slot?.className}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border bg-muted p-3 text-left font-semibold">Period</th>
              {DAYS.slice(0, timetable.constraints.daysPerWeek).map((day) => (
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
                  {DAYS.slice(0, timetable.constraints.daysPerWeek).map((day) => {
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
    </div>
  )
}
