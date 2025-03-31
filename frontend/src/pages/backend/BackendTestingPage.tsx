import { TestTube, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function TestingPage() {
  const testingTools: TechItem[] = [
    { name: "Jest", category: "Unit Testing", status: "production", version: "29.7" },
    { name: "PyTest", category: "Python Testing", status: "production", version: "8.0" },
    { name: "JUnit", category: "Java Testing", status: "production", version: "5.10" },
    { name: "Postman", category: "API Testing", status: "production", version: "10.23" },
    { name: "k6", category: "Load Testing", status: "testing", version: "0.49" },
    { name: "Locust", category: "Load Testing", status: "planned", version: "2.24" },
    { name: "SonarQube", category: "Code Quality", status: "production", version: "10.3" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <TestTube className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Backend Testing & QA</h1>
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