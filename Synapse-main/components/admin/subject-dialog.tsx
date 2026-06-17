"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subject } from "@/lib/models/subject"
import type { User } from "@/lib/models/user"
import { Loader2 } from "lucide-react"
import { nanoid } from "nanoid"

interface SubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject?: Subject
  onSuccess: () => void
}

const colors = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#6366f1",
  "#f97316",
  "#14b8a6",
  "#a855f7",
]

export function SubjectDialog({ open, onOpenChange, subject, onSuccess }: SubjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState<User[]>([])
  const [selectedColor, setSelectedColor] = useState(subject?.color || colors[0])

  useEffect(() => {
    if (open) {
      fetchTeachers()
    }
  }, [open])

  async function fetchTeachers() {
    try {
      const response = await fetch("/api/users?role=teacher")
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error("[v0] Failed to fetch teachers:", error)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const teacherId = formData.get("teacherId") as string
    const teacher = teachers.find((t) => t.userId === teacherId)

    const data = {
      subjectId: subject?.subjectId || nanoid(),
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      teacherId,
      teacherName: teacher?.name || "",
      duration: Number.parseInt(formData.get("duration") as string),
      color: selectedColor,
    }

    try {
      const url = subject ? `/api/subjects/${subject.subjectId}` : "/api/subjects"
      const method = subject ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Failed to save subject:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input id="name" name="name" defaultValue={subject?.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input id="code" name="code" defaultValue={subject?.code} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher</Label>
            <Select name="teacherId" defaultValue={subject?.teacherId} required>
              <SelectTrigger id="teacherId">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.userId} value={teacher.userId}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="30"
              max="180"
              defaultValue={subject?.duration || 60}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "white" : "transparent",
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {subject ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
