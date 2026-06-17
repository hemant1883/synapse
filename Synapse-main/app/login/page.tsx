import { LoginForm } from "@/components/auth/login-form"
import { Calendar } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold">TimeTable Pro</span>
            </Link>
            <h2 className="mt-8 text-3xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h3 className="text-4xl font-bold text-balance">Streamline Your Academic Scheduling</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Access your personalized timetable and manage your schedule efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
