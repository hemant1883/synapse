import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BookOpen, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">TimeTable Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Automated Timetable Generation for Educational Institutions
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Streamline your scheduling process with intelligent timetable generation. Optimize class schedules, manage
              constraints, and provide seamless access to students and teachers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-base bg-transparent">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Scheduling</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Generate optimized timetables automatically based on your constraints and preferences.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Role-Based Access</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Secure portals for administrators, teachers, and students with personalized views.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Subject Management</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Organize subjects, teachers, and class divisions with an intuitive interface.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Timing</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Configure session timings, recess periods, and class durations to fit your needs.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to optimize your scheduling?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Join educational institutions already using TimeTable Pro to streamline their operations.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg">Get Started Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TimeTable Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
