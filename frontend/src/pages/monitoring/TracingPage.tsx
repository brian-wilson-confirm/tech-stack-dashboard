import { GitGraph, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function TracingPage() {
  const tracingTools: TechItem[] = [
    { name: "Jaeger", category: "Distributed Tracing", status: "production", version: "1.53" },
    { name: "Zipkin", category: "Distributed Tracing", status: "production", version: "2.24" },
    { name: "OpenTelemetry", category: "Observability", status: "production", version: "1.24" },
    { name: "Datadog APM", category: "Application Performance", status: "production" },
    { name: "New Relic APM", category: "Application Performance", status: "testing" },
    { name: "Lightstep", category: "Distributed Tracing", status: "testing" },
    { name: "Honeycomb", category: "Observability", status: "planned" },
    { name: "Sentry", category: "Error Tracking", status: "production", version: "1.39" },
    { name: "Elastic APM", category: "Application Performance", status: "testing", version: "8.12" },
    { name: "Instana", category: "Application Performance", status: "planned" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <GitGraph className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tracing</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {tracingTools.map((tech) => (
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