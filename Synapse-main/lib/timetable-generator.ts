import type { Class } from "@/lib/models/class"
import type { Subject } from "@/lib/models/subject"
import type { TimeSlot, TimetableConstraints } from "@/lib/models/timetable"

interface GenerationResult {
  success: boolean
  slots: TimeSlot[]
  errors?: string[]
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export class TimetableGenerator {
  private constraints: TimetableConstraints
  private classes: Class[]
  private subjects: Subject[]
  private slots: TimeSlot[] = []
  private teacherSchedule: Map<string, Set<string>> = new Map()
  private classSchedule: Map<string, Set<string>> = new Map()

  constructor(constraints: TimetableConstraints, classes: Class[], subjects: Subject[]) {
    this.constraints = constraints
    this.classes = classes
    this.subjects = subjects
  }

  generate(): GenerationResult {
    this.slots = []
    this.teacherSchedule = new Map()
    this.classSchedule = new Map()

    const errors: string[] = []

    try {
      // Generate slots for each class
      for (const classItem of this.classes) {
        const classSubjects = this.subjects.filter((s) => classItem.subjects.includes(s.subjectId))

        if (classSubjects.length === 0) {
          errors.push(`Class ${classItem.name} has no subjects assigned`)
          continue
        }

        // Calculate total periods needed
        const totalPeriodsAvailable =
          this.constraints.daysPerWeek * (this.constraints.periodsPerDay - this.constraints.recessPeriods.length)

        // Distribute subjects across the week
        // Clone to allow local modification (swapping)
        const subjectDistribution = [...this.distributeSubjects(classSubjects, totalPeriodsAvailable)]

        // Generate time slots
        let subjectIndex = 0
        for (let day = 0; day < this.constraints.daysPerWeek; day++) {
          for (let period = 1; period <= this.constraints.periodsPerDay; period++) {
            const dayName = DAYS[day]
            const timeSlot = this.calculateTimeSlot(period)

            // Check if this is a recess period
            if (this.constraints.recessPeriods.includes(period)) {
              this.slots.push({
                day: dayName,
                period,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                subjectId: "recess",
                subjectName: "Recess",
                teacherId: "",
                teacherName: "",
                classId: classItem.classId,
                className: `${classItem.name} ${classItem.division}`,
                isRecess: true,
              })
              continue
            }

            // Safety check
            if (subjectIndex >= subjectDistribution.length) {
                continue
            }

            // Assign subject
            const slotKey = `${dayName}-${period}`
            let currentSubject = subjectDistribution[subjectIndex]

            // Check teacher availability
            if (!this.isTeacherAvailable(currentSubject.teacherId, slotKey)) {
                // Try to swap with a future subject
                const swapIndex = this.findSwapIndex(subjectDistribution, subjectIndex, slotKey)
                
                if (swapIndex !== -1) {
                    // Perform Swap
                    [subjectDistribution[subjectIndex], subjectDistribution[swapIndex]] = 
                    [subjectDistribution[swapIndex], subjectDistribution[subjectIndex]];
                    
                    currentSubject = subjectDistribution[subjectIndex]
                } else {
                    // No swap found. We cannot place a subject here.
                    // Skip to next slot, hoping to place this subject later?
                    // No, if we continue, we move to next slot time.
                    // We do NOT increment subjectIndex, so we try this subject again.
                    // However, this leaves a hole in the timetable.
                    continue
                }
            }
            
            // Double check availability (in case swap failed or wasn't needed)
            if (this.isTeacherAvailable(currentSubject.teacherId, slotKey)) {
                this.slots.push({
                  day: dayName,
                  period,
                  startTime: timeSlot.start,
                  endTime: timeSlot.end,
                  subjectId: currentSubject.subjectId,
                  subjectName: currentSubject.name,
                  teacherId: currentSubject.teacherId,
                  teacherName: currentSubject.teacherName,
                  classId: classItem.classId,
                  className: `${classItem.name} ${classItem.division}`,
                })

                this.markTeacherBusy(currentSubject.teacherId, slotKey)
                this.markClassBusy(classItem.classId, slotKey)
                subjectIndex++
            }
          }
        }
      }

      return {
        success: errors.length === 0,
        slots: this.slots,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (error) {
      return {
        success: false,
        slots: [],
        errors: [error instanceof Error ? error.message : "Unknown error occurred"],
      }
    }
  }

  private distributeSubjects(subjects: Subject[], totalPeriods: number): Subject[] {
    const distribution: Subject[] = []
    if (subjects.length === 0) return []
    
    const periodsPerSubject = Math.floor(totalPeriods / subjects.length)
    const remainder = totalPeriods % subjects.length

    subjects.forEach((subject, index) => {
      const periods = periodsPerSubject + (index < remainder ? 1 : 0)
      for (let i = 0; i < periods; i++) {
        distribution.push(subject)
      }
    })

    // Shuffle to avoid clustering
    return this.shuffleArray(distribution)
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private calculateTimeSlot(period: number): { start: string; end: string } {
    const [hours, minutes] = this.constraints.startTime.split(":").map(Number)
    const startMinutes = hours * 60 + minutes + (period - 1) * this.constraints.periodDuration

    // Add recess time for periods after recess
    const recessMinutes =
      this.constraints.recessPeriods.filter((r) => r < period).length * this.constraints.recessDuration

    const totalStartMinutes = startMinutes + recessMinutes
    const totalEndMinutes = totalStartMinutes + this.constraints.periodDuration

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
    }

    return {
      start: formatTime(totalStartMinutes),
      end: formatTime(totalEndMinutes),
    }
  }

  private isTeacherAvailable(teacherId: string, slotKey: string): boolean {
    const schedule = this.teacherSchedule.get(teacherId)
    return !schedule || !schedule.has(slotKey)
  }

  private markTeacherBusy(teacherId: string, slotKey: string): void {
    if (!this.teacherSchedule.has(teacherId)) {
      this.teacherSchedule.set(teacherId, new Set())
    }
    this.teacherSchedule.get(teacherId)!.add(slotKey)
  }

  private markClassBusy(classId: string, slotKey: string): void {
    if (!this.classSchedule.has(classId)) {
      this.classSchedule.set(classId, new Set())
    }
    this.classSchedule.get(classId)!.add(slotKey)
  }

  private findSwapIndex(subjects: Subject[], currentIndex: number, slotKey: string): number {
    for (let i = currentIndex + 1; i < subjects.length; i++) {
      if (this.isTeacherAvailable(subjects[i].teacherId, slotKey)) {
         // Optimization: Prioritize subjects with different teachers to maximize success
         return i
      }
    }
    return -1
  }
}
