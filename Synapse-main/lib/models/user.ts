import type { ObjectId } from "mongodb"

export type UserRole = "admin" | "teacher" | "student"

export interface User {
  _id?: ObjectId
  userId: string
  email: string
  password: string
  name: string
  role: UserRole
  classId?: string
  subjects?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  userId: string
  email: string
  name: string
  role: UserRole
  classId?: string
}
