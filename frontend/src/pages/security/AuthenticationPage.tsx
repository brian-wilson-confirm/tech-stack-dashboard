import { Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function AuthenticationPage() {
  const authTools: TechItem[] = [
    { name: "Auth0", category: "Identity Provider", status: "production" },
    { name: "Okta", category: "Identity Provider", status: "production" },
    { name: "Keycloak", category: "Identity Provider", status: "testing", version: "23.0" },
    { name: "OAuth 2.0", category: "Authentication Protocol", status: "production" },
    { name: "OpenID Connect", category: "Authentication Protocol", status: "production" },
    { name: "SAML 2.0", category: "Authentication Protocol", status: "production" },
    { name: "JWT", category: "Token Management", status: "production" },
    { name: "Passport.js", category: "Authentication Middleware", status: "production", version: "0.7.0" },
    { name: "Firebase Auth", category: "Identity Provider", status: "testing" },
    { name: "Cognito", category: "Identity Provider", status: "planned" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Lock className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Authentication</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {authTools.map((tech) => (
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