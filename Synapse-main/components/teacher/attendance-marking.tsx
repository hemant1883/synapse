"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Class {
  classId: string
  name: string
  division: string
}

interface Subject {
  subjectId: string
  name: string
}

interface Student {
  userId: string
  name: string
  status?: "present" | "absent" | "late"
}

export function AttendanceMarking() {
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [period, setPeriod] = useState<string>("1")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      if (Array.isArray(data)) {
        setClasses(data)
      } else {
        setClasses([])
        console.error("Failed to fetch classes:", data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      setClasses([])
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects")
      const data = await res.json()
      if (Array.isArray(data)) {
        setSubjects(data)
      } else {
        setSubjects([])
        console.error("Failed to fetch subjects:", data)
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
      setSubjects([])
    }
  }

  const fetchStudents = async () => {
    if (!selectedClass) return
    setLoading(true)
    try {
      // First try to fetch existing attendance
       const attendanceRes = await fetch(`/api/attendance/class?classId=${selectedClass}&date=${date.toISOString()}`)
       const attendanceData = await attendanceRes.json()
       
       // Also fetch all students to map them
       const studentsRes = await fetch(`/api/classes/${selectedClass}/students`)
       const studentsList: Student[] = await studentsRes.json()

       if (attendanceData.attendance && attendanceData.attendance.length > 0) {
          // Logic for existing attendance handling would go here
       }

       // Default status to present
       const mappedStudents = studentsList.map(s => ({
         ...s,
         status: "present" as const
       }))
       
       setStudents(mappedStudents)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setStudents(prev => prev.map(s => 
      s.userId === studentId ? { ...s, status } : s
    ))
  }

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !period) {
        toast({
            title: "Validation Error",
            description: "Please select Class, Subject and Period",
            variant: "destructive",
        })
        return
    }

    setSaving(true)
    try {
        const records = students.map(s => ({
            studentId: s.userId,
            studentName: s.name,
            status: s.status || "present"
        }))

        // Look up names for cleaner data
        const className = classes.find(c => c.classId === selectedClass)?.name || "Unknown"
        const classDiv = classes.find(c => c.classId === selectedClass)?.division || ""
        const subjectName = subjects.find(s => s.subjectId === selectedSubject)?.name || "Unknown"

        const payload = {
            classId: selectedClass,
            className: `${className} ${classDiv}`,
            subjectId: selectedSubject,
            subjectName,
            period: parseInt(period),
            date: date,
            records
        }

        const res = await fetch("/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || "Failed to save")
        }

        toast({
            title: "Success",
            description: "Attendance marked successfully",
            className: "bg-green-600 text-white" 
        })
        
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to save attendance",
            variant: "destructive",
        })
    } finally {
        setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Attendance Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Select class details to mark attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Class</Label>
              <Select onValueChange={setSelectedClass} value={selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(classes) && classes.map(c => (
                    <SelectItem key={c.classId} value={c.classId}>
                      {c.name} {c.division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Subject</Label>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(subjects) && subjects.map(s => (
                    <SelectItem key={s.subjectId} value={s.subjectId}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Period / Slot</Label>
              <Select onValueChange={setPeriod} value={period}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <SelectItem key={p} value={p.toString()}>
                      Period {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={fetchStudents} disabled={!selectedClass} className="w-full">
               Fetch Students
            </Button>
          </CardContent>
        </Card>

        {students.length > 0 && (
            <Card className="h-fit">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Students List</CardTitle>
                        <CardDescription>
                            Total: {students.length} | Present: {students.filter(s => s.status === 'present').length} | Absent: {students.filter(s => s.status === 'absent').length}
                        </CardDescription>
                    </div>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : "Submit Attendance"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[600px] overflow-y-auto space-y-2">
                        {students.map(student => (
                            <div key={student.userId} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                <div className="font-medium">{student.name}</div>
                                <div className="flex gap-2">
                                    <Badge 
                                        variant={student.status === 'present' ? 'default' : 'outline'}
                                        className="cursor-pointer select-none"
                                        onClick={() => handleStatusChange(student.userId, 'present')}
                                    >
                                        Present
                                    </Badge>
                                    <Badge 
                                        variant={student.status === 'absent' ? 'destructive' : 'outline'}
                                        className="cursor-pointer select-none"
                                        onClick={() => handleStatusChange(student.userId, 'absent')}
                                    >
                                        Absent
                                    </Badge>
                                    <Badge 
                                        variant={student.status === 'late' ? 'secondary' : 'outline'}
                                        className="cursor-pointer select-none"
                                        onClick={() => handleStatusChange(student.userId, 'late')}
                                    >
                                        Late
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
