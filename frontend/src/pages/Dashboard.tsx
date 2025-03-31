import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Code2, Server, Database, Cloud } from "lucide-react"
import { CategoryWidget } from "@/components/widgets/CategoryWidget"
import { SecurityWidget } from "@/components/widgets/SecurityWidget"
import { MetricsWidget } from "@/components/widgets/MetricsWidget"
import { CoverageWidget } from "@/components/widgets/CoverageWidget"
import { TasksWidget } from "@/components/widgets/TasksWidget"

// Types from the individual pages
import type { TechStats } from "@/types"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [coverage, setCoverage] = useState<{ items: any[], overallProgress: number }>({ items: [], overallProgress: 0 })
  const [tasks, setTasks] = useState<any[]>([])

  // Fetch data from individual pages
  const fetchCategoryData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch tasks separately to ensure proper data structure
      const tasksResponse = await fetch('/api/tasks')
      const tasksData = await tasksResponse.json()
      setTasks(tasksData.tasks || [])

      // These would be actual API calls to your backend
      const [languages, backend, storage, devops, coverage] = await Promise.all([
        fetch('/api/tech/languages').then(res => res.json()),
        fetch('/api/tech/backend').then(res => res.json()),
        fetch('/api/tech/storage').then(res => res.json()),
        fetch('/api/tech/devops').then(res => res.json()),
        fetch('/api/coverage').then(res => res.json())
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

      setCoverage(coverage)

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
        {categories.map((category) => (
          <CategoryWidget
            key={category.name}
            name={category.name}
            icon={category.icon}
            stats={category.stats}
            recentUpdates={category.recentUpdates}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <CoverageWidget 
          items={coverage.items}
          overallProgress={coverage.overallProgress}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <TasksWidget tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityWidget 
          alerts={securityAlerts} 
        />
        <MetricsWidget 
          metrics={metrics} 
        />
      </div>
    </div>
  )
} 