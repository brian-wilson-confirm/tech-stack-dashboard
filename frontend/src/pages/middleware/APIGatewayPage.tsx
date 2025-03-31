import { Network, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function APIGatewayPage() {
  const gatewayTech: TechItem[] = [
    { name: "Kong", category: "API Gateway", status: "production", version: "3.6" },
    { name: "Nginx", category: "Reverse Proxy", status: "production", version: "1.25" },
    { name: "Traefik", category: "Edge Router", status: "testing", version: "2.10" },
    { name: "AWS API Gateway", category: "Cloud Gateway", status: "production" },
    { name: "Envoy", category: "Service Proxy", status: "planned", version: "1.28" },
    { name: "Tyk", category: "API Gateway", status: "planned", version: "5.2" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Network className="h-8 w-8" />
        <h1 className="text-3xl font-bold">API Gateway</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {gatewayTech.map((tech) => (
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