import { Code2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function RuntimeEnvPage() {
  const runtimeTech: TechItem[] = [
    { name: "Node.js", category: "JavaScript Runtime", status: "production", version: "20.11" },
    { name: "Deno", category: "JavaScript Runtime", status: "testing", version: "1.41" },
    { name: "Bun", category: "JavaScript Runtime", status: "planned", version: "1.0" },
    { name: "Chrome V8", category: "JavaScript Engine", status: "production", version: "12.3" },
    { name: "WebAssembly", category: "Binary Format", status: "testing" },
    { name: "Web Workers", category: "Concurrency", status: "production" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Code2 className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Frontend Runtime Environments</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {runtimeTech.map((tech) => (
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