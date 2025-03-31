import { Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function AuthorizationPage() {
  const authzTools: TechItem[] = [
    { name: "RBAC", category: "Access Control Model", status: "production" },
    { name: "ABAC", category: "Access Control Model", status: "testing" },
    { name: "Casbin", category: "Authorization Library", status: "production", version: "2.82" },
    { name: "Ory Keto", category: "Authorization Service", status: "testing", version: "0.13" },
    { name: "Open Policy Agent", category: "Policy Engine", status: "production", version: "0.61" },
    { name: "AWS IAM", category: "Cloud IAM", status: "production" },
    { name: "Azure RBAC", category: "Cloud IAM", status: "production" },
    { name: "Google Cloud IAM", category: "Cloud IAM", status: "testing" },
    { name: "Keycloak Authorization", category: "Authorization Service", status: "testing", version: "23.0" },
    { name: "Pomerium", category: "Access Proxy", status: "planned", version: "0.25" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Authorization</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {authzTools.map((tech) => (
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