"use client"

import type { Subject } from "@/lib/models/subject"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { SubjectDialog } from "@/components/admin/subject-dialog"

interface SubjectsListProps {
  subjects: Subject[]
  isLoading: boolean
  onUpdate: () => void
}

export function SubjectsList({ subjects, isLoading, onUpdate }: SubjectsListProps) {
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  async function handleDelete(subjectId: string) {
    if (!confirm("Are you sure you want to delete this subject?")) return

    try {
      await fetch(`/api/subjects/${subjectId}`, { method: "DELETE" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to delete subject:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading subjects...</div>
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No subjects found. Add your first subject to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <div key={subject.subjectId} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: subject.color }}
                aria-label={`${subject.name} color indicator`}
              />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditingSubject(subject)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.subjectId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{subject.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Code: {subject.code}</p>
            <p className="mt-2 text-sm text-muted-foreground">Teacher: {subject.teacherName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Duration: {subject.duration} minutes</p>
          </div>
        ))}
      </div>

      {editingSubject && (
        <SubjectDialog
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          subject={editingSubject}
          onSuccess={() => {
            setEditingSubject(null)
            onUpdate()
          }}
        />
      )}
    </>
  )
}
