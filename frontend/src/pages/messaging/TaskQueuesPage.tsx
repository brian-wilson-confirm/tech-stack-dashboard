import { ListTodo, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function TaskQueuesPage() {
  const queueTools: TechItem[] = [
    { name: "Celery", category: "Task Queue", status: "production", version: "5.3" },
    { name: "RabbitMQ", category: "Message Broker", status: "production", version: "3.12" },
    { name: "Redis Queue", category: "Task Queue", status: "production", version: "1.15" },
    { name: "Apache Kafka", category: "Message Streaming", status: "production", version: "3.6" },
    { name: "Bull", category: "Job Queue", status: "testing", version: "4.12" },
    { name: "Amazon SQS", category: "Message Queue", status: "production" },
    { name: "Apache ActiveMQ", category: "Message Broker", status: "testing", version: "5.18" },
    { name: "ZeroMQ", category: "Message Queue", status: "planned", version: "4.3" },
    { name: "Temporal", category: "Workflow Engine", status: "testing", version: "1.22" },
    { name: "Sidekiq", category: "Background Jobs", status: "planned", version: "7.2" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <ListTodo className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tasks & Queues</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {queueTools.map((tech) => (
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