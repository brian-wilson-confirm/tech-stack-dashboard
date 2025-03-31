import { Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function CachePage() {
  const cacheServices: TechItem[] = [
    { name: "Redis", category: "In-Memory Store", status: "production", version: "7.2" },
    { name: "Memcached", category: "Distributed Cache", status: "production", version: "1.6" },
    { name: "Hazelcast", category: "In-Memory Grid", status: "testing", version: "5.4" },
    { name: "Apache Ignite", category: "In-Memory Platform", status: "planned", version: "2.16" },
    { name: "Elasticache", category: "Managed Cache", status: "production" },
    { name: "Caffeine", category: "Local Cache", status: "testing", version: "3.1" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Zap className="h-8 w-8" />
        <h1 className="text-3xl font-bold">In-Memory Caches</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {cacheServices.map((tech) => (
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