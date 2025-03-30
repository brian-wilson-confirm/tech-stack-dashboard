import { Boxes, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesignPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Boxes className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Design Engineering</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Projects</h2>
          <div className="space-y-3">
            {['UI Components', 'Design System', 'Prototypes'].map((project) => (
              <div key={project} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <span className="font-medium">{project}</span>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <div className="space-y-3">
            {['Lead Designer', 'UI Engineer', 'UX Researcher'].map((member) => (
              <div key={member} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {member[0]}
                </div>
                <span className="font-medium">{member}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 