"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SubjectDialog } from "@/components/admin/subject-dialog"
import { SubjectsList } from "@/components/admin/subjects-list"
import type { Subject } from "@/lib/models/subject"

export function SubjectsManager() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    try {
      const response = await fetch("/api/subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("[v0] Failed to fetch subjects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="mt-2 text-muted-foreground">Manage subjects and assign teachers</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <SubjectsList subjects={subjects} isLoading={isLoading} onUpdate={fetchSubjects} />
      <SubjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchSubjects} />
    </div>
  )
}
