import BarChartComponent from "@/components/charts/bar-chart"
import BarChartHorizontal from "@/components/charts/bar-chart-horizontal"

export default function AssessmentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Assessments</h1>
      <div className="mt-8">
        {/* Assessment management content will go here */}

          <div className="grid grid-cols-2 gap-6 mb-8">
            <BarChartComponent />
            <BarChartHorizontal />
          </div>
      </div>
    </div>
  )
} 