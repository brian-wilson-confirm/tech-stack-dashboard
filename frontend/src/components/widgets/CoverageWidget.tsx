import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CoverageItem {
  category: string
  percentage: number
}

interface CoverageWidgetProps {
  items: CoverageItem[]
  overallProgress: number
}

export function CoverageWidget({ items, overallProgress }: CoverageWidgetProps) {
  return (
    <div className="border rounded-lg p-6 col-span-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">Tech Stack Coverage</h2>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.category}</span>
              <span className="text-sm text-muted-foreground">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 