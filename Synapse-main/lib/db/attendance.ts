import { getDatabase } from "@/lib/mongodb"
import type { Attendance, AttendanceRecord } from "@/lib/models/attendance"
import { nanoid } from "nanoid"

export async function createAttendance(
  data: Omit<Attendance, "_id" | "attendanceId" | "createdAt" | "updatedAt">,
) {
  const db = await getDatabase()
  const attendanceId = nanoid()
  
  const attendance: Attendance = {
    ...data,
    attendanceId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.collection<Attendance>("attendance").insertOne(attendance)
  return attendanceId
}

export async function getAttendanceByClassAndDate(
  classId: string,
  date: Date,
  period?: number
) {
  const db = await getDatabase()
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const query: any = {
    classId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }

  if (period !== undefined) {
    query.period = period
  }

  return db.collection<Attendance>("attendance").find(query).toArray()
}

export async function getAttendanceByStudent(studentId: string) {
  const db = await getDatabase()
  return db.collection<Attendance>("attendance")
    .find({ "records.studentId": studentId })
    .sort({ date: -1 })
    .toArray()
}

export async function getAttendanceByTeacher(teacherId: string) {
  const db = await getDatabase()
  return db.collection<Attendance>("attendance")
    .find({ teacherId })
    .sort({ date: -1 })
    .toArray()
}

export async function checkAttendanceExists(
  classId: string,
  subjectId: string,
  date: Date,
  period: number
) {
  const db = await getDatabase()
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const existing = await db.collection<Attendance>("attendance").findOne({
    classId,
    subjectId,
    period,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    }
  })

  return !!existing
}

export async function updateAttendance(attendanceId: string, records: AttendanceRecord[]) {
  const db = await getDatabase()
  return db.collection<Attendance>("attendance").updateOne(
    { attendanceId },
    {
      $set: {
        records,
        updatedAt: new Date(),
      },
    }
  )
}
