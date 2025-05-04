import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Code2, Server, Database, Cloud } from "lucide-react"
import { CategoryWidget } from "@/components/widgets/CategoryWidget"
import { SecurityWidget } from "@/components/widgets/SecurityWidget"
import { MetricsWidget } from "@/components/widgets/MetricsWidget"
import { CoverageWidget } from "@/components/widgets/CoverageWidget"
import { toast } from '@/components/ui/use-toast'
import { usePageTitle } from '@/hooks/usePageTitle'
import { QuickAddTaskWidget } from '@/components/widgets/QuickAddTaskWidget'
import BarChartHorizontal from '@/components/charts/bar-chart-horizontal'
import TodaysTasksWidget from '@/components/widgets/TodaysTasksWidget'
import TasksCompletedWidget from '@/components/widgets/polished/TasksCompletedWidget'



export default function Dashboard() {
  // Set page title
  usePageTitle('Dashboard')

  /*******************
    STATE VARIABLES
  ********************/
  // Fetching Data
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [coverage, setCoverage] = useState<{ items: any[], overallProgress: number }>({ items: [], overallProgress: 0 })



  /***********************
    PAGE LOAD
  ***********************/
  // Fetch data from individual pages
  const fetchCategoryData = async () => {
    try {
      setIsLoading(true)

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
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks.",
        variant: "destructive",
      })
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
        <h1 className="text-3xl font-bold">Personal AI Learning Management System</h1>
        <Button 
          onClick={fetchCategoryData}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <TasksCompletedWidget />
      </div>


      {/* Today's Tasks and Quick Add Task side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 mb-8">
        <TodaysTasksWidget />
        <QuickAddTaskWidget />
      </div>


      {/* Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CoverageWidget 
          items={coverage.items}
          overallProgress={coverage.overallProgress}
        />
        <BarChartHorizontal />
      </div>

      {/* Security and System Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SecurityWidget 
          alerts={securityAlerts} 
        />
        <MetricsWidget 
          metrics={metrics} 
        />
      </div>


      {/* Category Widgets: Language, Backend, Data Storage, and DevOps */}
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
      
    </div>
  )
} 