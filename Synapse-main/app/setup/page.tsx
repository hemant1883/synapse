import { redirect } from "next/navigation"
import { getAllUsers } from "@/lib/db/users"
import { AdminSetupForm } from "@/components/auth/admin-setup-form"

export default async function SetupPage() {
  const users = await getAllUsers()
  const adminExists = users.some((user) => user.role === "admin")

  if (adminExists) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Initial Setup</h1>
          <p className="mt-2 text-muted-foreground">Create your administrator account to get started</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <AdminSetupForm />
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Important Notes:</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Only one admin account can exist in the system</li>
            <li>• This account will have full access to manage the timetable system</li>
            <li>• Keep your credentials secure</li>
            <li>• After setup, you can create classes, subjects, and user accounts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
