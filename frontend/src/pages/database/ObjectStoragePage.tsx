import { HardDrive, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TechItem {
  name: string
  category: string
  status: "production" | "testing" | "planned"
  version?: string
}

export default function ObjectStoragePage() {
  const storageServices: TechItem[] = [
    { name: "Amazon S3", category: "Cloud Storage", status: "production" },
    { name: "Google Cloud Storage", category: "Cloud Storage", status: "testing" },
    { name: "Azure Blob Storage", category: "Cloud Storage", status: "planned" },
    { name: "MinIO", category: "Self-hosted Storage", status: "production", version: "2024.2" },
    { name: "Ceph", category: "Distributed Storage", status: "testing", version: "18.2" },
    { name: "Cloudflare R2", category: "Edge Storage", status: "planned" }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <HardDrive className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Object Storage</h1>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Stack</h2>
          <div className="grid gap-4">
            {storageServices.map((tech) => (
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