import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useState } from "react"

interface QuickAddTaskWidgetProps {
  onClose?: () => void
}

export function QuickAddTaskWidget({ onClose }: QuickAddTaskWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const resourceUrl = (form.elements.namedItem('resourceUrl') as HTMLInputElement).value
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value

    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks/from-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: resourceUrl,
          notes: notes 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      toast.success('Task created successfully')
      form.reset()
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Quick Add Task</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="resourceUrl" className="text-lg font-medium">
              Resource URL
            </label>
            <Input
              id="resourceUrl"
              name="resourceUrl"
              type="url"
              placeholder="https://..."
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-lg font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes or comments..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full text-lg font-medium"
              onClick={() => {
                const advancedSection = document.getElementById('advancedSection')
                if (advancedSection) {
                  advancedSection.classList.toggle('hidden')
                }
              }}
            >
              Advanced
            </Button>
            <div id="advancedSection" className="hidden space-y-4">
              {/* Advanced options can be added here */}
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Adding Task...' : 'Add Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 