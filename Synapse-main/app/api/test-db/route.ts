import { NextResponse } from "next/server"
import { testConnection, getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    // Test basic connection
    const isConnected = await testConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to MongoDB",
          troubleshooting: [
            "1. Verify MONGODB_URI is set in environment variables",
            "2. Check if your IP address is whitelisted in MongoDB Atlas (Network Access)",
            "3. Ensure the connection string includes the correct username and password",
            "4. Verify the database user has proper permissions",
          ],
        },
        { status: 500 },
      )
    }

    // Test database access
    const db = await getDatabase()
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: "timetable_system",
      collections: collections.map((c) => c.name),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[v0] Database test error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Database connection error",
        error: error.message,
        troubleshooting: [
          "1. Check if MONGODB_URI environment variable is set correctly",
          "2. Verify MongoDB Atlas IP whitelist includes your current IP or 0.0.0.0/0",
          "3. Ensure connection string format: mongodb+srv://username:password@cluster.mongodb.net/",
          "4. Check if MongoDB Atlas cluster is running",
          "5. Verify network connectivity to MongoDB Atlas",
        ],
      },
      { status: 500 },
    )
  }
}
