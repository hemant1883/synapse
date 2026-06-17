"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClassDialog } from "@/components/admin/class-dialog"
import { ClassesList } from "@/components/admin/classes-list"
import type { Class } from "@/lib/models/class"

export function ClassesManager() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  async function fetchClasses() {
    try {
      const response = await fetch("/api/classes")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("[v0] Failed to fetch classes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="mt-2 text-muted-foreground">Manage class divisions and student groups</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <ClassesList classes={classes} isLoading={isLoading} onUpdate={fetchClasses} />
      <ClassDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchClasses} />
    </div>
  )
}
