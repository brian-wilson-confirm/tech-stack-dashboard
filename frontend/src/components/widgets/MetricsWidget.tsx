import { LineChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Metric {
  name: string
  value: string
  trend: "up" | "down" | "stable"
}

interface MetricsWidgetProps {
  metrics: Metric[]
}

export function MetricsWidget({ metrics }: MetricsWidgetProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <LineChart className="h-5 w-5" />
        <h2 className="font-semibold">System Metrics</h2>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm">{metric.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{metric.value}</span>
              <span 
                className={cn(
                  "text-xs",
                  metric.trend === "up" && "text-green-500",
                  metric.trend === "down" && "text-red-500",
                  metric.trend === "stable" && "text-yellow-500"
                )}
              >
                {metric.trend === "up" && "↑"}
                {metric.trend === "down" && "↓"}
                {metric.trend === "stable" && "→"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 