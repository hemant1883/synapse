"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AttendanceItem {
  date: string
  subjectName: string
  period: number
  status: "present" | "absent" | "late"
  teacherName: string
}

interface Stats {
  total: number
  present: number
  absent: number
  late: number
  percentage: number
}

export function AttendanceView() {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance/student")
      const data = await res.json()
      
      if (data.attendance) {
        setAttendance(data.attendance)
        calculateStats(data.attendance)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: AttendanceItem[]) => {
    const total = data.length
    if (total === 0) return

    const present = data.filter(r => r.status === 'present').length
    const absent = data.filter(r => r.status === 'absent').length
    const late = data.filter(r => r.status === 'late').length
    
    const effectivePresent = present + late
    const percentage = (effectivePresent / total) * 100

    setStats({
        total,
        present,
        absent,
        late,
        percentage
    })
  }

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'present': return 'default'
          case 'absent': return 'destructive'
          case 'late': return 'secondary'
          default: return 'outline'
      }
  }

  if (loading) {
      return <div className="p-8">Loading attendance...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Attendance</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{stats.percentage.toFixed(1)}%</div>
                <Progress value={stats.percentage} className="mt-4" />
                <p className="text-xs text-muted-foreground mt-2">
                    {stats.present + stats.late} present out of {stats.total} sessions
                </p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Stats Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Present</span>
                        <span className="font-bold text-green-600">{stats.present}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Absent</span>
                        <span className="font-bold text-red-600">{stats.absent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Late</span>
                        <span className="font-bold text-yellow-600">{stats.late}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Detailed log of all classes</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Status</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {attendance.map((record, index) => (
                          <TableRow key={index}>
                              <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                              <TableCell>{record.subjectName}</TableCell>
                              <TableCell>{record.period}</TableCell>
                              <TableCell>{record.teacherName}</TableCell>
                              <TableCell>
                                  <Badge variant={getStatusColor(record.status) as any}>
                                      {record.status.toUpperCase()}
                                  </Badge>
                              </TableCell>
                          </TableRow>
                      ))}
                      {attendance.length === 0 && (
                          <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                  No attendance records found
                              </TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  )
}
