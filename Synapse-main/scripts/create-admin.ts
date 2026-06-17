import { createUser } from "../lib/db/users"

async function createAdmin() {
  try {
    const adminEmail = "admin@timetable.com"
    const adminPassword = "admin123"

    // Create admin user
    // Note: createUser handles password hashing internally
    const userId = await createUser({
      name: "System Administrator",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    })

    console.log("✅ Admin user created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🔑 Password:", adminPassword)
    console.log("🆔 User ID:", userId)
    console.log("\n⚠️  Please change the password after first login!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
