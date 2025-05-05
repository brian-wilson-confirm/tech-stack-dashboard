import * as React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, ResponsiveContainer, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

// Custom Tooltip for Bar Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white p-3 rounded shadow border text-xs min-w-[120px]">
      <div className="font-bold mb-1">{new Date(label).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}</div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">Tasks</span>
        <span className="font-semibold">{payload[0].value}</span>
      </div>
    </div>
  );
};

export default function TasksCompletedWidget() {
  const [chartData, setChartData] = React.useState<{ date: string; tasks: number }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const res = await fetch("/api/tasks/completed-by-day")
      const data = await res.json()
      setChartData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.tasks, 0),
    [chartData]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Number of Tasks Completed by Day</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `Total completed in last 90 days: ${total}`}
          </CardDescription>
        </div>
        {/*<div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {typeof chartConfig[chart] === 'object' && chartConfig[chart] !== null && 'label' in chartConfig[chart]
                    ? (chartConfig[chart] as { label: string }).label
                    : null}
                </span>
                <span className="text-xs font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>*/}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={{ data: chartData, xAxisKey: "date", yAxisKey: "tasks" }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              {/* @ts-ignore */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
                tick={{ fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <YAxis tickLine={false} axisLine={true} tick={{ fontSize: 12 }} />
              {/* @ts-ignore */}
              <Tooltip content={<CustomTooltip />} />
              {/* @ts-ignore */}
              <Bar dataKey="tasks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
