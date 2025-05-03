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
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  data: chartData,
  xAxisKey: "month",
  yAxisKey: "desktop",
  color: "hsl(var(--chart-1))",
}

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
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
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            {/* @ts-ignore */}
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel label={""} value={""} />} // You may need to adjust ChartTooltipContent props
            />
            {/* @ts-ignore */}
            <Bar dataKey="desktop" fill="hsl(var(--chart-1))" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
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