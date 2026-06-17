"use client"

import { useState, useEffect } from "react"
import type { Subject } from "@/lib/models/subject"
import { Loader2, BookOpen } from "lucide-react"

export function StudentSubjectsView() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  async function fetchSubjects() {
    try {
      const response = await fetch("/api/student/subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("[v0] Failed to fetch subjects:", error)
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
        <p className="mt-2 text-muted-foreground">Subjects in your class curriculum</p>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No subjects available for your class yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div key={subject.subjectId} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: subject.color }}
                  aria-label={`${subject.name} color indicator`}
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Code: {subject.code}</p>
              <p className="mt-2 text-sm text-muted-foreground">Teacher: {subject.teacherName}</p>
              <p className="mt-1 text-sm text-muted-foreground">Duration: {subject.duration} minutes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
