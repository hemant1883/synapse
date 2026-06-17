import type { ObjectId } from "mongodb"

export interface TimeSlot {
  day: string
  period: number
  startTime: string
  endTime: string
  subjectId: string
  subjectName: string
  teacherId: string
  teacherName: string
  classId: string
  className: string
  isRecess?: boolean
}

export interface TimetableConstraints {
  daysPerWeek: number
  periodsPerDay: number
  periodDuration: number
  startTime: string
  recessPeriods: number[]
  recessDuration: number
  maxPeriodsPerTeacher: number
  maxPeriodsPerSubject: number
}

export interface Timetable {
  _id?: ObjectId
  timetableId: string
  name: string
  academicYear: string
  semester: string
  constraints: TimetableConstraints
  slots: TimeSlot[]
  status: "draft" | "published" | "archived"
  createdAt: Date
  updatedAt: Date
  generatedAt?: Date
}
