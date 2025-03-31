import { type LucideIcon } from "lucide-react"

export interface TechStats {
  total: number
  production: number
  testing: number
  planned: number
}

export interface CategorySummary {
  name: string
  icon: LucideIcon
  stats: TechStats
  recentUpdates: string[]
}

export interface SecurityAlert {
  level: "high" | "medium" | "low"
  message: string
}

export interface Metric {
  name: string
  value: string
  trend: "up" | "down" | "stable"
} 