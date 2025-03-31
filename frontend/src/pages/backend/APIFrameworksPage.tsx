import { Webhook, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function APIFrameworksPage() {
  const frameworks: TechItem[] = [
    { name: "GraphQL", category: "Query Language", status: "production", version: "16.8" },
    { name: "REST Framework", category: "REST API", status: "production", version: "3.14" },
    { name: "gRPC", category: "RPC Framework", status: "testing", version: "1.59" },
    { name: "tRPC", category: "End-to-end Typesafe API", status: "testing", version: "10.45" },
    { name: "Apollo Server", category: "GraphQL Server", status: "production", version: "4.10" },
    { name: "Swagger/OpenAPI", category: "API Documentation", status: "production", version: "3.0" },
    { name: "Prisma", category: "Database Toolkit", status: "production", version: "5.9" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Webhook className="h-8 w-8" />
        <h1 className="text-3xl font-bold">API Frameworks</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {frameworks.map((tech) => (
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