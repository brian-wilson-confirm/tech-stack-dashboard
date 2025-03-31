import { Bell, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function AlertingPage() {
  const alertingTools: TechItem[] = [
    { name: "Prometheus Alertmanager", category: "Alert Management", status: "production", version: "0.27" },
    { name: "Grafana Alerting", category: "Alert Management", status: "production", version: "10.2" },
    { name: "PagerDuty", category: "Incident Management", status: "production" },
    { name: "OpsGenie", category: "Incident Management", status: "production" },
    { name: "VictorOps", category: "Incident Management", status: "testing" },
    { name: "Datadog Alerts", category: "Alert Management", status: "production" },
    { name: "New Relic Alerts", category: "Alert Management", status: "testing" },
    { name: "Splunk ITSI", category: "IT Service Intelligence", status: "production" },
    { name: "Elastic Alerting", category: "Alert Management", status: "testing", version: "8.12" },
    { name: "OpsRamp", category: "IT Operations", status: "planned" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Alerting</h1>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg p-6 border-[1px] border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {alertingTools.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tech.name}</span>
                    {tech.version && (
                      <span className="text-sm text-muted-foreground">v{tech.version}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tech.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={cn(
                      "text-sm flex items-center gap-1",
                      tech.status === "production" && "text-green-500",
                      tech.status === "testing" && "text-yellow-500",
                      tech.status === "planned" && "text-blue-500"
                    )}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {tech.status}
                  </span>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 