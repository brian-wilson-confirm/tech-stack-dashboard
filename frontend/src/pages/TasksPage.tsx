import { useState, useEffect, useCallback } from "react"
import { CheckSquare } from "lucide-react"

import TempWidget from "@/components/widgets/TempWidget"
import { TasksWidget } from "@/components/widgets/TasksWidget"
import { Task } from "@/components/data/schema"
import NewWidget from "@/components/widgets/NewWidget"
import DataTableWidget from "@/components/widgets/DataTableWidget"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /***********************
   API: Get Tasks
  ***********************/
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  /***********************
   Handle Task Updates
  ***********************/
  const handleTaskUpdate = useCallback(async (updatedTask: Task) => {
    // Refresh the entire task list to ensure we have the latest data
    await fetchTasks()
  }, [fetchTasks])

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CheckSquare className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>
      {/*
      <div className="grid gap-6">
        <TasksWidget tasks={tasks} />
      </div>
      <br />
      <div className="grid gap-6">
        <TempWidget 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
      <br />*/}
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">New Widget</h2>
        <NewWidget tasks={tasks} />
      </div>
      <br />
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">DataTable Widget</h2>
        <DataTableWidget rows={tasks} />
      </div>
    </div>
  )
} 