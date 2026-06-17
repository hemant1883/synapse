import type { ObjectId } from "mongodb"

export type AttendanceStatus = "present" | "absent" | "late"

export interface AttendanceRecord {
  studentId: string
  studentName: string
  status: AttendanceStatus
  remarks?: string
}

export interface Attendance {
  _id?: ObjectId
  attendanceId: string
  date: Date
  classId: string
  className: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  period: number // The timetable period number
  startTime?: string
  endTime?: string
  records: AttendanceRecord[]
  createdAt: Date
  updatedAt: Date
}
