"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Class } from "@/lib/models/class"
import type { Subject } from "@/lib/models/subject"
import { Loader2 } from "lucide-react"
import { nanoid } from "nanoid"

interface ClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classData?: Class
  onSuccess: () => void
}

export function ClassDialog({ open, onOpenChange, classData, onSuccess }: ClassDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(classData?.subjects || [])

  useEffect(() => {
    if (open) {
      fetchSubjects()
    }
  }, [open])

  async function fetchSubjects() {
    try {
      const response = await fetch("/api/subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("[v0] Failed to fetch subjects:", error)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    const data = {
      classId: classData?.classId || nanoid(),
      name: formData.get("name") as string,
      division: formData.get("division") as string,
      studentCount: Number.parseInt(formData.get("studentCount") as string),
      subjects: selectedSubjects,
    }

    try {
      const url = classData ? `/api/classes/${classData.classId}` : "/api/classes"
      const method = classData ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Failed to save class:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input id="name" name="name" defaultValue={classData?.name} placeholder="e.g., Grade 10" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Input id="division" name="division" defaultValue={classData?.division} placeholder="e.g., A" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentCount">Number of Students</Label>
            <Input
              id="studentCount"
              name="studentCount"
              type="number"
              min="1"
              defaultValue={classData?.studentCount || 30}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border p-4">
              {subjects.map((subject) => (
                <div key={subject.subjectId} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.subjectId}
                    checked={selectedSubjects.includes(subject.subjectId)}
                    onCheckedChange={() => toggleSubject(subject.subjectId)}
                  />
                  <label
                    htmlFor={subject.subjectId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject.name} ({subject.code})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {classData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
