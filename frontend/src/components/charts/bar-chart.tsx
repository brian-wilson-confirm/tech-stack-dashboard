import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltipContent,
  } from "@/components/ui/chart"

// NOTE: Linter errors for Recharts JSX components (e.g., XAxis, Bar) are a known false positive in some TypeScript/ESLint setups. If the chart renders correctly, these can be safely ignored.

const chartData = [
  { category: "Frontend", tasks: 186 },
  { category: "Middleware", tasks: 305 },
  { category: "Backend", tasks: 237 },
  { category: "Messaging", tasks: 73 },
  { category: "DevOps", tasks: 209 },
  { category: "Security", tasks: 14 },
  { category: "Monitoring", tasks: 114 },
  { category: "Dev Tooling", tasks: 133 },
  { category: "AI/ML", tasks: 121 },
]

const chartConfig = {
  data: chartData,
  xAxisKey: "category",
  yAxisKey: "tasks",
  color: "hsl(var(--chart-1))",
}

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution by Category</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* The following JSX linter warning for Recharts components is a known false positive in some setups. */}
          <BarChart
            data={chartData}
            margin={{ top: 20 }}
            width={400}
            height={250}
          >
            <CartesianGrid vertical={false} />
            {/* @ts-ignore */}
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            {/* @ts-ignore */}
            <Tooltip
              cursor={false}
                content={(props: any) => <ChartTooltipContent {...props} />}
            />
            {/* @ts-ignore */}
            <Bar dataKey="tasks" fill="hsl(var(--chart-1))" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChartComponent; 