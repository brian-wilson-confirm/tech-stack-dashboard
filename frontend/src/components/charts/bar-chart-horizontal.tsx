import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const chartData = [
  { category: "Frontend", tasks: 186 },
  { category: "Middleware", tasks: 305 },
  { category: "Backend", tasks: 237 },
  { category: "Messaging", tasks: 73 },
  { category: "DevOps", tasks: 209 },
  { category: "Security", tasks: 84 },
  { category: "Monitoring", tasks: 114 },
  { category: "Dev Tooling", tasks: 133 },
  { category: "AI/ML", tasks: 121 },
]

const chartConfig = {
  data: chartData,
  xAxisKey: "tasks",
  yAxisKey: "category",
  color: "hsl(var(--chart-1))",
}

// Custom Tooltip matching the screenshot
function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-600 px-4 py-3 min-w-[120px]">
        <div className="font-semibold text-base text-gray-900 mb-1">{data.category}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Tasks</span>
          <span className="ml-auto text-xs font-bold text-gray-900">{data.tasks}</span>
        </div>
      </div>
    )
  }
  return null;
}

export function BarChartHorizontal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution by Category</CardTitle>
        <CardDescription>Open Tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
            width={400}
            height={350}
          >
            <CartesianGrid horizontal={false} />
            {/* @ts-ignore */}
            <YAxis
              dataKey="category"
              type="category"
              tick={false}
              tickLine={false}
              axisLine={false}
            />
            {/* @ts-ignore */}
            <XAxis dataKey="tasks" type="number" hide />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {/* @ts-ignore */}
            <Bar
              dataKey="tasks"
              layout="vertical"
              fill="hsl(var(--chart-1))"
              radius={4}
              barSize={32}
              gap={10}
              //minPointSize={4}
            >
              {/* Category label inside bar */}
              <LabelList
                dataKey="category"
                position="insideLeft"
                offset={8}
                className="fill-white"
                //className="fill-white font-medium text-base"
                fontSize={12}
              />
              {/* Value label outside bar */}
              <LabelList
                dataKey="tasks"
                position="right"
                offset={8}
                className="fill-foreground"
                //className="fill-gray-900 font-medium text-base"
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

export default BarChartHorizontal; 