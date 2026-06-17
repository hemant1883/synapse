import { getDatabase } from "@/lib/mongodb"
import type { Class } from "@/lib/models/class"

export async function createClass(classData: Omit<Class, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  const classDoc: Omit<Class, "_id"> = {
    ...classData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Class>("classes").insertOne(classDoc as Class)
  return result.insertedId
}

export async function getClassesBySubjectIds(subjectIds: string[]) {
  const db = await getDatabase()
  return db.collection<Class>("classes").find({ subjects: { $in: subjectIds } }).toArray()
}

export async function getAllClasses() {
  const db = await getDatabase()
  return db.collection<Class>("classes").find().toArray()
}

export async function getClassById(classId: string) {
  const db = await getDatabase()
  return db.collection<Class>("classes").findOne({ classId })
}

export async function updateClass(classId: string, updates: Partial<Class>) {
  const db = await getDatabase()
  return db.collection<Class>("classes").updateOne({ classId }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteClass(classId: string) {
  const db = await getDatabase()
  return db.collection<Class>("classes").deleteOne({ classId })
}
