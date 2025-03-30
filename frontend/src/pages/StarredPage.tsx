import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StarredPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Starred Items</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Starred Item {i + 1}</h2>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-muted-foreground">
              This is a description for starred item {i + 1}. Click to view more details.
            </p>
            <Button variant="secondary" className="w-full">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  )
} 