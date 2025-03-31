import { Database, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function NoSQLDatabasesPage() {
  const nosqlDatabases: TechItem[] = [
    { name: "MongoDB", category: "Document Store", status: "production", version: "7.0" },
    { name: "Redis", category: "Key-Value Store", status: "production", version: "7.2" },
    { name: "Cassandra", category: "Wide Column Store", status: "testing", version: "5.0" },
    { name: "Neo4j", category: "Graph Database", status: "planned", version: "5.16" },
    { name: "DynamoDB", category: "Key-Value Store", status: "production" },
    { name: "Elasticsearch", category: "Search Engine", status: "production", version: "8.12" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Database className="h-8 w-8" />
        <h1 className="text-3xl font-bold">NoSQL Databases</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {nosqlDatabases.map((tech) => (
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