import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { type LucideIcon } from "lucide-react"

interface TechStats {
  total: number
  production: number
  testing: number
  planned: number
}

interface CategoryWidgetProps {
  name: string
  icon: LucideIcon
  stats: TechStats
  recentUpdates: string[]
}

export function CategoryWidget({ name, icon: Icon, stats, recentUpdates }: CategoryWidgetProps) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5" />
        <h2 className="font-semibold">{name}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <span className="text-2xl font-bold">{stats.total}</span>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{stats.production}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{stats.testing}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{stats.planned}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Recent Updates</h3>
        {recentUpdates.map((update, i) => (
          <p key={i} className="text-sm text-muted-foreground">{update}</p>
        ))}
      </div>
    </div>
  )
} 