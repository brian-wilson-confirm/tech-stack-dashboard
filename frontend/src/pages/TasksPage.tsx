import { useState, useEffect } from "react"
import { CheckSquare } from "lucide-react"

import TempWidget from "@/components/widgets/TempWidget"
import { TasksWidget } from "@/components/widgets/TasksWidget"


export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  /***********************
   API: Get Tasks
  ***********************/
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CheckSquare className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      <div className="grid gap-6">
        {/*<TasksWidget tasks={tasks} />*/}
      </div>
      <br></br>
      <div className="grid gap-6">
        <TempWidget tasks={tasks} />
      </div>
    </div>
  )
} 