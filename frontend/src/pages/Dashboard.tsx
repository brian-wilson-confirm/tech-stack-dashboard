import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Code2, Server, Database, Cloud } from "lucide-react"
import { CategoryWidget } from "@/components/widgets/CategoryWidget"
import { SecurityWidget } from "@/components/widgets/SecurityWidget"
import { MetricsWidget } from "@/components/widgets/MetricsWidget"

// Types from the individual pages
import type { TechStats } from "@/types"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])

  // Fetch data from individual pages
  const fetchCategoryData = async () => {
    try {
      setIsLoading(true)
      // These would be actual API calls to your backend
      const [languages, backend, storage, devops] = await Promise.all([
        fetch('/api/tech/languages').then(res => res.json()),
        fetch('/api/tech/backend').then(res => res.json()),
        fetch('/api/tech/storage').then(res => res.json()),
        fetch('/api/tech/devops').then(res => res.json())
      ])

      setCategories([
        {
          name: "Languages & Frameworks",
          icon: Code2,
          stats: languages.stats,
          recentUpdates: languages.updates
        },
        {
          name: "Backend Services",
          icon: Server,
          stats: backend.stats,
          recentUpdates: backend.updates
        },
        {
          name: "Data Storage",
          icon: Database,
          stats: storage.stats,
          recentUpdates: storage.updates
        },
        {
          name: "DevOps & Cloud",
          icon: Cloud,
          stats: devops.stats,
          recentUpdates: devops.updates
        }
      ])

      // Fetch security data
      const security = await fetch('/api/security/alerts').then(res => res.json())
      setSecurityAlerts(security.alerts)

      // Fetch metrics data
      const systemMetrics = await fetch('/api/metrics').then(res => res.json())
      setMetrics(systemMetrics.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryData()
  }, [])

  // For demo purposes, using mock data until API is ready
  const mockData = {
    categories: [
      {
        name: "Languages & Frameworks",
        icon: Code2,
        stats: {
          total: 24,
          production: 14,
          testing: 6,
          planned: 4
        },
        recentUpdates: [
          "Python updated to v3.12",
          "TypeScript v5.3 deployed",
          "React v18.2 in production"
        ]
      },
      {
        name: "Backend Services",
        icon: Server,
        stats: {
          total: 18,
          production: 12,
          testing: 4,
          planned: 2
        },
        recentUpdates: [
          "Node.js v20 LTS deployed",
          "Django REST framework updated",
          "GraphQL Gateway testing"
        ]
      },
      {
        name: "Data Storage",
        icon: Database,
        stats: {
          total: 15,
          production: 8,
          testing: 4,
          planned: 3
        },
        recentUpdates: [
          "PostgreSQL 16 migration complete",
          "Redis Cache layer expanded",
          "MongoDB Atlas evaluation"
        ]
      },
      {
        name: "DevOps & Cloud",
        icon: Cloud,
        stats: {
          total: 20,
          production: 11,
          testing: 5,
          planned: 4
        },
        recentUpdates: [
          "Kubernetes v1.28 rollout",
          "Terraform modules updated",
          "New CI/CD pipeline active"
        ]
      }
    ],
    securityAlerts: [
      { level: "high", message: "Dependencies security audit needed" },
      { level: "medium", message: "JWT token expiration review" },
      { level: "low", message: "SSL certificate renewal in 30 days" }
    ],
    metrics: [
      { name: "System Uptime", value: "99.98%", trend: "up" },
      { name: "API Response Time", value: "245ms", trend: "stable" },
      { name: "Error Rate", value: "0.02%", trend: "down" }
    ]
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tech Stack Dashboard</h1>
        <Button 
          onClick={fetchCategoryData}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(categories.length ? categories : mockData.categories).map((category) => (
          <CategoryWidget
            key={category.name}
            name={category.name}
            icon={category.icon}
            stats={category.stats}
            recentUpdates={category.recentUpdates}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityWidget 
          alerts={securityAlerts.length ? securityAlerts : mockData.securityAlerts} 
        />
        <MetricsWidget 
          metrics={metrics.length ? metrics : mockData.metrics} 
        />
      </div>
    </div>
  )
} 