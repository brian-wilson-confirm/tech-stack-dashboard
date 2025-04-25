import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">Calendar functionality coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
} 