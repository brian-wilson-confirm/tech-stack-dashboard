import { Wrench, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function BuildToolsPage() {
  const buildTools: TechItem[] = [
    { name: "Vite", category: "Build Tool", status: "production", version: "5.0" },
    { name: "Webpack", category: "Module Bundler", status: "production", version: "5.89" },
    { name: "Babel", category: "Transpiler", status: "production", version: "7.23" },
    { name: "esbuild", category: "Bundler", status: "testing", version: "0.19" },
    { name: "Rollup", category: "Module Bundler", status: "testing", version: "4.9" },
    { name: "SWC", category: "Transpiler", status: "planned", version: "1.3" },
    { name: "Turbopack", category: "Build Tool", status: "planned", version: "1.0" },
    { name: "PostCSS", category: "CSS Tools", status: "production", version: "8.4" },
    { name: "Prettier", category: "Code Formatter", status: "production", version: "3.1" },
    { name: "ESLint", category: "Linter", status: "production", version: "8.56" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Wrench className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Build Tools</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {buildTools.map((tech) => (
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