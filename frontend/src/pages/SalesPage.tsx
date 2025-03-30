import { Users, TrendingUp, Target } from "lucide-react"

export default function SalesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Sales & Marketing</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">Sales Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-2xl font-bold">$24,500</p>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
            <div className="h-[2px] bg-border" />
            <div className="space-y-2">
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">New Customers</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
          </div>
          <div className="space-y-3">
            {['Social Media', 'Email', 'Content'].map((campaign) => (
              <div key={campaign} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <span className="font-medium">{campaign}</span>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <div className="space-y-3">
            {[
              { name: 'John Doe', sales: '45 deals' },
              { name: 'Jane Smith', sales: '38 deals' },
              { name: 'Mike Johnson', sales: '31 deals' }
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <span className="font-medium">{member.name}</span>
                <span className="text-sm text-muted-foreground">{member.sales}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 