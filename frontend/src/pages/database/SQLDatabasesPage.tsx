import { Database, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function SQLDatabasesPage() {
  const sqlDatabases: TechItem[] = [
    { name: "PostgreSQL", category: "Relational Database", status: "production", version: "16.1" },
    { name: "MySQL", category: "Relational Database", status: "production", version: "8.3" },
    { name: "MariaDB", category: "Relational Database", status: "testing", version: "11.3" },
    { name: "Oracle", category: "Enterprise Database", status: "production", version: "23c" },
    { name: "SQL Server", category: "Enterprise Database", status: "planned", version: "2022" },
    { name: "CockroachDB", category: "Distributed SQL", status: "testing", version: "23.2" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Database className="h-8 w-8" />
        <h1 className="text-3xl font-bold">SQL Databases</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {sqlDatabases.map((tech) => (
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