import { TestTube, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function FrontendTestingPage() {
  const testingTools: TechItem[] = [
    { name: "Vitest", category: "Unit Testing", status: "production", version: "1.2" },
    { name: "Jest", category: "Unit Testing", status: "production", version: "29.7" },
    { name: "Testing Library", category: "Component Testing", status: "production", version: "14.2" },
    { name: "Cypress", category: "E2E Testing", status: "production", version: "13.6" },
    { name: "Playwright", category: "E2E Testing", status: "testing", version: "1.41" },
    { name: "Storybook", category: "Component Development", status: "production", version: "7.6" },
    { name: "MSW", category: "API Mocking", status: "testing", version: "2.1" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <TestTube className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Frontend Testing & QA</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {testingTools.map((tech) => (
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