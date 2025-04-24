import { Settings, MapPin, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddTechnologyWidget } from "@/components/widgets/AddTechnologyWidget"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Widget #1 */}
        <div className="border rounded-lg p-6">
          <AddTechnologyWidget />
        </div>

        {/* Widget #2 */}
        <div className="border rounded-lg p-6">
          <AddTechnologyWidget />
        </div>

        {/* Widget #3 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Auto-Discover Resource Classification</h2>
          <div className="space-y-4">
            {[
              {
                destination: 'Course'
              },
              {
                destination: 'Module'
              },
              {
                destination: 'Lesson'
              },
              {
                destination: 'Resource'
              }
            ].map((obj) => (
              <div key={obj.destination} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{obj.destination}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Category</Button>
                <Button variant="outline" size="sm">Subcategory</Button>
                <Button variant="outline" size="sm">Lesson</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Widget #4 */} 
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Settings Stats</h2>
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