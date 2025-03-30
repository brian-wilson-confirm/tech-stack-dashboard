import { Plane, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TravelPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Plane className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Travel Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
          <div className="space-y-4">
            {[
              {
                destination: 'New York',
                date: 'Mar 15 - Mar 20',
                status: 'Confirmed'
              },
              {
                destination: 'San Francisco',
                date: 'Apr 1 - Apr 5',
                status: 'Pending'
              },
              {
                destination: 'London',
                date: 'Apr 15 - Apr 22',
                status: 'Planning'
              }
            ].map((trip) => (
              <div key={trip.destination} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{trip.destination}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{trip.date}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">{trip.status}</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Travel Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Total Trips</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Flight Hours</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">$12.5k</p>
              <p className="text-sm text-muted-foreground">Budget Used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 