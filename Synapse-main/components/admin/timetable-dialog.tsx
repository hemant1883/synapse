"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function TimetableDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    const data = {
      name: formData.get("name") as string,
      academicYear: formData.get("academicYear") as string,
      semester: formData.get("semester") as string,
      constraints: {
        daysPerWeek: Number.parseInt(formData.get("daysPerWeek") as string),
        periodsPerDay: Number.parseInt(formData.get("periodsPerDay") as string),
        periodDuration: Number.parseInt(formData.get("periodDuration") as string),
        startTime: formData.get("startTime") as string,
        recessPeriods: (formData.get("recessPeriods") as string).split(",").map((p) => Number.parseInt(p.trim())),
        recessDuration: Number.parseInt(formData.get("recessDuration") as string),
        maxPeriodsPerTeacher: Number.parseInt(formData.get("maxPeriodsPerTeacher") as string),
        maxPeriodsPerSubject: Number.parseInt(formData.get("maxPeriodsPerSubject") as string),
      },
    }

    try {
      const response = await fetch("/api/timetables/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate timetable")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate New Timetable</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Timetable Name</Label>
            <Input id="name" name="name" placeholder="e.g., Spring 2025 Timetable" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input id="academicYear" name="academicYear" placeholder="e.g., 2024-2025" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" name="semester" placeholder="e.g., Spring" required />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border p-4">
            <h3 className="font-semibold">Schedule Configuration</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="daysPerWeek">Days per Week</Label>
                <Input id="daysPerWeek" name="daysPerWeek" type="number" min="1" max="7" defaultValue="5" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodsPerDay">Periods per Day</Label>
                <Input
                  id="periodsPerDay"
                  name="periodsPerDay"
                  type="number"
                  min="1"
                  max="12"
                  defaultValue="8"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodDuration">Period Duration (minutes)</Label>
                <Input
                  id="periodDuration"
                  name="periodDuration"
                  type="number"
                  min="30"
                  max="120"
                  defaultValue="45"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" name="startTime" type="time" defaultValue="08:00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recessPeriods">Recess Periods (comma-separated)</Label>
                <Input id="recessPeriods" name="recessPeriods" placeholder="e.g., 4, 7" defaultValue="4" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recessDuration">Recess Duration (minutes)</Label>
                <Input
                  id="recessDuration"
                  name="recessDuration"
                  type="number"
                  min="10"
                  max="60"
                  defaultValue="15"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPeriodsPerTeacher">Max Periods per Teacher</Label>
                <Input
                  id="maxPeriodsPerTeacher"
                  name="maxPeriodsPerTeacher"
                  type="number"
                  min="1"
                  max="40"
                  defaultValue="30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPeriodsPerSubject">Max Periods per Subject</Label>
                <Input
                  id="maxPeriodsPerSubject"
                  name="maxPeriodsPerSubject"
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Timetable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
