import { Button } from "@/components/ui/button"

export default function HistoryPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Recent Activities</h2>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium">Activity {i + 1}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 