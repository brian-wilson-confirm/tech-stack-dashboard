import { ScrollText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function LoggingPage() {
  const loggingTools: TechItem[] = [
    { name: "ELK Stack", category: "Log Management", status: "production", version: "8.12" },
    { name: "Graylog", category: "Log Management", status: "testing", version: "5.2" },
    { name: "Loki", category: "Log Aggregation", status: "production", version: "2.9" },
    { name: "Fluentd", category: "Log Forwarder", status: "production", version: "1.16" },
    { name: "Filebeat", category: "Log Shipper", status: "production", version: "8.12" },
    { name: "Logstash", category: "Log Processor", status: "production", version: "8.12" },
    { name: "Splunk", category: "Log Analytics", status: "production" },
    { name: "Datadog Logs", category: "Log Analytics", status: "testing" },
    { name: "New Relic Logs", category: "Log Analytics", status: "planned" },
    { name: "OpenTelemetry", category: "Observability", status: "production", version: "1.24" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <ScrollText className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Logging</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {loggingTools.map((tech) => (
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