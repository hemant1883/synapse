import type { ObjectId } from "mongodb"

export interface Subject {
  _id?: ObjectId
  subjectId: string
  name: string
  code: string
  teacherId: string
  teacherName: string
  duration: number
  color: string
  createdAt: Date
  updatedAt: Date
}
