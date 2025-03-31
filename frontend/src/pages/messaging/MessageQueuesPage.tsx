import { ListOrdered, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function MessageQueuesPage() {
  const queues: TechItem[] = [
    { name: "RabbitMQ", category: "Message Queue", status: "production", version: "3.12" },
    { name: "Amazon SQS", category: "Cloud Queue", status: "production" },
    { name: "Apache ActiveMQ", category: "Message Queue", status: "testing", version: "5.18" },
    { name: "ZeroMQ", category: "Distributed Queue", status: "planned", version: "4.3" },
    { name: "Google Cloud Pub/Sub", category: "Cloud Queue", status: "testing" },
    { name: "Azure Service Bus", category: "Cloud Queue", status: "planned" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <ListOrdered className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Message Queues</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {queues.map((tech) => (
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