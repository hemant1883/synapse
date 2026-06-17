"use client"

import type { Class } from "@/lib/models/class"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Users } from "lucide-react"
import { useState } from "react"
import { ClassDialog } from "@/components/admin/class-dialog"

interface ClassesListProps {
  classes: Class[]
  isLoading: boolean
  onUpdate: () => void
}

export function ClassesList({ classes, isLoading, onUpdate }: ClassesListProps) {
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  async function handleDelete(classId: string) {
    if (!confirm("Are you sure you want to delete this class?")) return

    try {
      await fetch(`/api/classes/${classId}`, { method: "DELETE" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to delete class:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading classes...</div>
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No classes found. Add your first class to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div key={classItem.classId} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditingClass(classItem)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(classItem.classId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{classItem.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Division: {classItem.division}</p>
            <p className="mt-2 text-sm text-muted-foreground">{classItem.studentCount} students</p>
            <p className="mt-1 text-sm text-muted-foreground">{classItem.subjects.length} subjects</p>
          </div>
        ))}
      </div>

      {editingClass && (
        <ClassDialog
          open={!!editingClass}
          onOpenChange={(open) => !open && setEditingClass(null)}
          classData={editingClass}
          onSuccess={() => {
            setEditingClass(null)
            onUpdate()
          }}
        />
      )}
    </>
  )
}
