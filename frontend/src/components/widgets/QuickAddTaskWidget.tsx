import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface QuickAddTaskWidgetProps {
  onClose?: () => void
}

export function QuickAddTaskWidget({ onClose }: QuickAddTaskWidgetProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const resourceUrl = (form.elements.namedItem('resourceUrl') as HTMLInputElement).value
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value

    setIsLoading(true)
    try {

      const socket = new WebSocket("ws://localhost:8000/api/tasks/ws/quick-add");

      socket.onopen = () => {
        setIsLoading(true);
        setProgress(8); // <-- initial value before backend responds
        setStage("Starting...");
        socket.send(JSON.stringify({ resourceUrl }));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.progress) {
          setProgress(message.progress);
          setStage(message.stage);
          console.log("Message:", message);
        }

        if (message.progress === 100) {
          socket.close();
          setIsLoading(false);

          toast({
            title: "Task Created",
            description: "The task has been successfully created.",
            duration: 3000,
            variant: "default",
          });
          form.reset()
        }
      };

      /*
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

      toast({
        title: "Task Created",
        description: "The task has been successfully created.",
        duration: 3000,
        variant: "default",
      });
      form.reset() */
    } catch (error: any) {
      console.error('Error creating task:', error)
      toast({
        title: "Error",
        description: error.response.data.detail || "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Loading Dialog */}
      <Dialog open={isLoading}>
        <DialogContent className="flex flex-col items-center justify-center gap-4 max-w-xs [&>button[data-dialog-close]]:hidden">
          <DialogTitle>
            <VisuallyHidden>
              Create Task
            </VisuallyHidden>
          </DialogTitle>
          <DialogDescription>
            <VisuallyHidden>
              We’re setting up your task. This may take a few seconds.
            </VisuallyHidden>
          </DialogDescription>
          <div className="text-lg font-semibold">{stage}</div>
          <Progress value={progress} className="w-[60%]" />
          <span className="text-sm text-gray-500">{progress}%</span>
        </DialogContent>
      </Dialog>
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
    </>
  )
} 