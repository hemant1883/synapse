import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to environment variables")
}

const uri = process.env.MONGODB_URI

const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("[v0] MongoDB connected successfully in development mode")
        return client
      })
      .catch((error) => {
        console.error("[v0] MongoDB connection error:", error.message)
        throw error
      })
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("[v0] MongoDB connected successfully in production mode")
      return client
    })
    .catch((error) => {
      console.error("[v0] MongoDB connection error:", error.message)
      throw error
    })
}

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB_NAME || "timetable_system"
    return client.db(dbName)
  } catch (error) {
    console.error("[v0] Failed to get database:", error)
    throw new Error("Database connection failed. Please check your MongoDB URI and network settings.")
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("[v0] MongoDB connection test successful")
    return true
  } catch (error) {
    console.error("[v0] MongoDB connection test failed:", error)
    return false
  }
}

export default clientPromise
