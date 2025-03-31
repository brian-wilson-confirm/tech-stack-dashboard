import { GitBranch, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function CICDPage() {
  const cicdTools: TechItem[] = [
    { name: "GitHub Actions", category: "CI/CD Platform", status: "production" },
    { name: "Jenkins", category: "CI/CD Server", status: "production", version: "2.426" },
    { name: "GitLab CI", category: "CI/CD Platform", status: "testing", version: "16.9" },
    { name: "CircleCI", category: "CI/CD Platform", status: "production" },
    { name: "ArgoCD", category: "GitOps Platform", status: "testing", version: "2.9" },
    { name: "Flux", category: "GitOps Platform", status: "planned", version: "2.2" },
    { name: "Tekton", category: "CI/CD Framework", status: "testing", version: "0.57" },
    { name: "Drone", category: "CI/CD Platform", status: "planned", version: "2.17" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <GitBranch className="h-8 w-8" />
        <h1 className="text-3xl font-bold">CI/CD Pipeline</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {cicdTools.map((tech) => (
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