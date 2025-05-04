import { ReactNode } from "react"

export interface ChartConfig {
  data: any[]
  xAxisKey: string
  yAxisKey: string
  color?: string
  height?: number
  width?: number
  desktop?: {
    label: string
    color: string
  }
  mobile?: {
    label: string
    color: string
  }
}

export interface ChartContainerProps {
  children: ReactNode
  config: ChartConfig
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  )
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  children?: ReactNode
}

export function ChartTooltip({ active, payload, label, children }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-2 border rounded shadow">
      {children}
    </div>
  )
}

export interface ChartTooltipContentProps {
  label: string
  value: string | number
  hideLabel?: boolean
}

export function ChartTooltipContent({ label, value, hideLabel }: ChartTooltipContentProps) {
  return (
    <div className="text-sm">
      {!hideLabel && <p className="font-medium">{label}</p>}
      <p className="text-muted-foreground">{value}</p>
    </div>
  )
} 