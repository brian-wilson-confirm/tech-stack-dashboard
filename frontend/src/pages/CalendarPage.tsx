import { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  startTime?: string
  endTime?: string
  isAllDay?: boolean
  isLongEvent?: boolean
  isRepeating?: boolean
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week' | 'month'>('month')

  // Sample events data
  const events: CalendarEvent[] = [
    { id: '1', title: 'All Day Event', date: new Date(2024, 1, 1), isAllDay: true },
    { id: '2', title: 'Long Event', date: new Date(2024, 1, 6), isLongEvent: true },
    { id: '3', title: 'Meeting', date: new Date(2024, 1, 14), startTime: '2:30a' },
    { id: '4', title: 'Lunch', date: new Date(2024, 1, 14), startTime: '4a' },
    { id: '5', title: 'Meeting', date: new Date(2024, 1, 14), startTime: '6:30a' },
    { id: '6', title: 'Happy Hour', date: new Date(2024, 1, 14), startTime: '9:30a' },
    { id: '7', title: 'Dinner', date: new Date(2024, 1, 14), startTime: '12p' },
    { id: '8', title: 'Birthday Party', date: new Date(2024, 1, 14), startTime: '11p' },
    { id: '9', title: 'Repeating Event', date: new Date(2024, 1, 9), startTime: '8a', isRepeating: true },
    { id: '10', title: 'Click for Google', date: new Date(2024, 1, 28) }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = []
    
    // Add days from previous month to start on Sunday
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      daysInMonth.push(day)
    }
    
    // Add all days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, month, day))
    }
    
    // Add days from next month to complete the calendar grid
    const remainingDays = 42 - daysInMonth.length // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      daysInMonth.push(new Date(year, month + 1, day))
    }
    
    return daysInMonth
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CalendarIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Calendar</h1>
      </div>

      <div className="border rounded-lg bg-white">
        {/* Calendar Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold ml-2">
              {formatMonthYear(currentDate)}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              onClick={() => setView('day')}
              className="text-sm"
            >
              day
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
              className="text-sm"
            >
              week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
              className="text-sm"
            >
              month
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const dayEvents = getEventsForDate(date)
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b relative",
                  !isCurrentMonth && "bg-gray-50 text-gray-400"
                )}
              >
                <span className="text-sm">{date.getDate()}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs p-1 rounded truncate",
                        event.isAllDay && "bg-blue-500 text-white",
                        event.isLongEvent && "bg-blue-500 text-white",
                        !event.isAllDay && !event.isLongEvent && "bg-blue-100 text-blue-700"
                      )}
                    >
                      {event.startTime && <span className="mr-1">{event.startTime}</span>}
                      {event.title}
                      {event.isRepeating && " ↻"}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 