import type { ObjectId } from "mongodb"

export interface Class {
  _id?: ObjectId
  classId: string
  name: string
  division: string
  studentCount: number
  subjects: string[]
  createdAt: Date
  updatedAt: Date
}
