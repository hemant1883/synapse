import { getDatabase } from "@/lib/mongodb"
import type { Timetable } from "@/lib/models/timetable"

export async function createTimetable(timetableData: Omit<Timetable, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  const timetable: Omit<Timetable, "_id"> = {
    ...timetableData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Timetable>("timetables").insertOne(timetable as Timetable)
  return result.insertedId
}

export async function getAllTimetables() {
  const db = await getDatabase()
  return db.collection<Timetable>("timetables").find().toArray()
}

export async function getTimetableById(timetableId: string) {
  const db = await getDatabase()
  return db.collection<Timetable>("timetables").findOne({ timetableId })
}

export async function getPublishedTimetables() {
  const db = await getDatabase()
  return db.collection<Timetable>("timetables").find({ status: "published" }).toArray()
}

export async function updateTimetable(timetableId: string, updates: Partial<Timetable>) {
  const db = await getDatabase()
  return db
    .collection<Timetable>("timetables")
    .updateOne({ timetableId }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteTimetable(timetableId: string) {
  const db = await getDatabase()
  return db.collection<Timetable>("timetables").deleteOne({ timetableId })
}
