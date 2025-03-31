import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface SecurityAlert {
  level: "high" | "medium" | "low"
  message: string
}

interface SecurityWidgetProps {
  alerts: SecurityAlert[]
}

export function SecurityWidget({ alerts }: SecurityWidgetProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="h-5 w-5" />
        <h2 className="font-semibold">Security Status</h2>
      </div>
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <div 
            key={i}
            className={cn(
              "p-3 rounded-md",
              alert.level === "high" && "bg-red-500/10",
              alert.level === "medium" && "bg-yellow-500/10",
              alert.level === "low" && "bg-blue-500/10"
            )}
          >
            <p className="text-sm">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 