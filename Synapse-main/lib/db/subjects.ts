import { getDatabase } from "@/lib/mongodb"
import type { Subject } from "@/lib/models/subject"

export async function createSubject(subjectData: Omit<Subject, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  const subject: Omit<Subject, "_id"> = {
    ...subjectData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Subject>("subjects").insertOne(subject as Subject)
  return result.insertedId
}

export async function getSubjectsByTeacher(teacherId: string) {
  const db = await getDatabase()
  return db.collection<Subject>("subjects").find({ teacherId }).toArray()
}

export async function getAllSubjects() {
  const db = await getDatabase()
  return db.collection<Subject>("subjects").find().toArray()
}

export async function getSubjectById(subjectId: string) {
  const db = await getDatabase()
  return db.collection<Subject>("subjects").findOne({ subjectId })
}

export async function updateSubject(subjectId: string, updates: Partial<Subject>) {
  const db = await getDatabase()
  return db.collection<Subject>("subjects").updateOne({ subjectId }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteSubject(subjectId: string) {
  const db = await getDatabase()
  return db.collection<Subject>("subjects").deleteOne({ subjectId })
}
