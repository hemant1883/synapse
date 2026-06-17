import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"

export async function createUser(userData: Omit<User, "_id" | "userId" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const userDoc: Omit<User, "_id"> = {
    userId,
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.collection<User>("users").insertOne(userDoc as User)
  return userId
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ email })
}

export async function getUserById(userId: string) {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ userId })
}

export async function getAllUsers() {
  const db = await getDatabase()
  return db.collection<User>("users").find().toArray()
}

export async function getAllTeachers() {
  const db = await getDatabase()
  return db.collection<User>("users").find({ role: "teacher" }).toArray()
}

export async function getAllStudents() {
  const db = await getDatabase()
  return db.collection<User>("users").find({ role: "student" }).toArray()
}

export async function getStudentsByClass(classId: string) {
  const db = await getDatabase()
  return db.collection<User>("users").find({ role: "student", classId }).toArray()
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const db = await getDatabase()

  const updateData: any = { ...updates, updatedAt: new Date() }

  if (updates.password) {
    updateData.password = await bcrypt.hash(updates.password, 10)
  }

  return db.collection<User>("users").updateOne({ userId }, { $set: updateData })
}

export async function deleteUser(userId: string) {
  const db = await getDatabase()
  return db.collection<User>("users").deleteOne({ userId })
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}
