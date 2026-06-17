"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Class {
  classId: string
  name: string
  division: string
}

export function AttendanceManager() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      if (Array.isArray(data)) {
        setClasses(data)
      } else {
        setClasses([])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      setClasses([])
    }
  }

  const fetchAttendance = async () => {
    if (!selectedClass) return
    setLoading(true)
    try {
       // Using the class endpoint to get records for a day
       const res = await fetch(`/api/attendance/class?classId=${selectedClass}&date=${date.toISOString()}`)
       const data = await res.json()
       setAttendanceData(data.attendance || [])
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Global Attendance Overview</h1>
      
      <Card className="mb-8">
          <CardHeader>
              <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex flex-col space-y-2 w-full md:w-64">
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

            <div className="flex flex-col space-y-2 w-full md:w-auto">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
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
            
            <Button onClick={fetchAttendance} disabled={!selectedClass}>
                Load Attendance
            </Button>
          </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-6">
          {attendanceData.map((session) => (
             <Card key={session.attendanceId}>
                 <CardHeader>
                     <div className="flex justify-between items-center">
                         <div>
                            <CardTitle>{session.subjectName}</CardTitle>
                            <CardDescription>
                                Period {session.period} | Teacher: {session.teacherName}
                            </CardDescription>
                         </div>
                         <div className="text-right text-sm">
                             <div>Present: <span className="text-green-600 font-bold">{session.records.filter((r:any) => r.status === 'present').length}</span></div>
                             <div>Absent: <span className="text-red-600 font-bold">{session.records.filter((r:any) => r.status === 'absent').length}</span></div>
                         </div>
                     </div>
                 </CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {session.records.map((student: any) => (
                                <TableRow key={student.studentId}>
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            student.status === 'present' ? 'default' : 
                                            student.status === 'absent' ? 'destructive' : 'secondary'
                                        }>
                                            {student.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </CardContent>
             </Card>
          ))}
          {attendanceData.length === 0 && !loading && (
             <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                 No attendance records found for this criteria.
             </div>
          )}
      </div>
    </div>
  )
}
