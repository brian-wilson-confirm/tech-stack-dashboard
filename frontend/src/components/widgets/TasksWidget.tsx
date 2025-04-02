import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SortConfig {
  field: keyof Task
  direction: 'asc' | 'desc'
}

interface SortableColumnProps {
  field: keyof Task
  children: React.ReactNode
  sortConfigs: SortConfig[]
  onSort: (field: keyof Task, isMultiSort: boolean) => void
}

function SortableColumn({ field, children, sortConfigs, onSort }: SortableColumnProps) {
  const sortConfig = sortConfigs.find(config => config.field === field)
  const sortIndex = sortConfigs.findIndex(config => config.field === field)

  return (
    <div
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={(e: React.MouseEvent) => onSort(field, e.shiftKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig ? (
          <div className="flex items-center">
            <span className="text-xs mr-1">{sortIndex + 1}</span>
            {sortConfig.direction === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </div>
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  )
}

interface Task {
  id: string
  done: boolean
  task: string
  technology: string
  subcategory: string
  category: string
  order: number
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  progress: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: string
  level: string
  section: string
  topics: string[]
  source: string
  estimated_duration: number
  actual_duration?: number
  start_date?: string
  end_date?: string
}

interface TasksWidgetProps {
  tasks: Task[]
}

// Add the form schema
const taskFormSchema = z.object({
  task: z.string().min(1, "Task name is required"),
  technology: z.string().min(1, "Technology is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  category: z.string().min(1, "Category is required"),
  order: z.number().min(0),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
  progress: z.number().min(0).max(100),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  type: z.string().min(1, "Type is required"),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  section: z.string().min(1, "Section is required"),
  topics: z.array(z.string()),
  source: z.string().min(1, "Source is required"),
  estimated_duration: z.number().min(0),
  actual_duration: z.number().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

// Add the AddTaskDialog component
function AddTaskDialog({ onAddTask }: { onAddTask: (task: TaskFormValues) => void }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      task: "",
      technology: "",
      subcategory: "",
      category: "",
      order: 0,
      status: "not_started",
      progress: 0,
      priority: "medium",
      type: "implementation",
      level: "intermediate",
      section: "",
      topics: [],
      source: "",
      estimated_duration: 0,
      actual_duration: null,
      start_date: null,
      end_date: null,
    },
  })

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add task')
      }

      const newTask = await response.json()
      onAddTask(newTask)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error adding task:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details for the new task. All required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more form fields for other task properties */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="implementation">Implementation</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add remaining form fields */}
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topics</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value.join(', ')}
                        onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()))}
                        placeholder="Comma-separated topics"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimated_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (hours) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actual_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Duration (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Adding Task...
                  </>
                ) : (
                  'Add Task'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function TasksWidget({ tasks: initialTasks }: TasksWidgetProps) {
  //console.log('Initial tasks in widget:', initialTasks)
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Task | null>(null)
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])

  const sortTasks = (tasksToSort: Task[]) => {
    if (sortConfigs.length === 0) return tasksToSort

    return [...tasksToSort].sort((a, b) => {
      for (const { field, direction } of sortConfigs) {
        const aValue = a[field]
        const bValue = b[field]

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return direction === 'asc' ? -1 : 1
        if (bValue === null || bValue === undefined) return direction === 'asc' ? 1 : -1

        // Compare values based on their type
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          if (comparison !== 0) return direction === 'asc' ? comparison : -comparison
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue
          if (comparison !== 0) return direction === 'asc' ? comparison : -comparison
        } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          const comparison = (aValue === bValue ? 0 : aValue ? 1 : -1)
          if (comparison !== 0) return direction === 'asc' ? comparison : -comparison
        } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
          const comparison = aValue.join(',').localeCompare(bValue.join(','))
          if (comparison !== 0) return direction === 'asc' ? comparison : -comparison
        }
      }
      return 0
    })
  }

  // Initialize tasks only once
  useEffect(() => {
    if (!tasks.length && initialTasks?.length) {
      setTasks(initialTasks)
    }
  }, [initialTasks])

  const handleSort = (field: keyof Task, isMultiSort: boolean) => {
    setSortConfigs(prevConfigs => {
      const existingConfigIndex = prevConfigs.findIndex(config => config.field === field)
      
      // If holding Shift key, add to existing sorts
      if (isMultiSort) {
        if (existingConfigIndex === -1) {
          // Add new sort config
          return [...prevConfigs, { field, direction: 'asc' }]
        } else {
          // Toggle direction of existing sort
          return prevConfigs.map((config, index) =>
            index === existingConfigIndex
              ? { ...config, direction: config.direction === 'asc' ? 'desc' : 'asc' }
              : config
          )
        }
      } else {
        // Without Shift, replace all sorts with just this one
        if (existingConfigIndex === -1) {
          return [{ field, direction: 'asc' }]
        } else {
          const config = prevConfigs[existingConfigIndex]
          return [{ field, direction: config.direction === 'asc' ? 'desc' : 'asc' }]
        }
      }
    })
  }

  const totalPages = Math.ceil(tasks.length / rowsPerPage)
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const sortedTasks = sortTasks(tasks)
  const currentTasks = sortedTasks.slice(start, end)

  const toggleTaskDone = (taskId: string, checked: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, done: checked } 
          : task
      )
    )
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditForm({ ...task })
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setEditForm(null)
  }

  const saveEditing = () => {
    if (editForm) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editForm.id ? editForm : task
        )
      )
      setEditingTask(null)
      setEditForm(null)
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleEditChange = (field: keyof Task, value: string | number | string[] | null) => {
    if (editForm) {
      let processedValue: any = value
      
      // Handle numeric fields
      if (['order', 'progress', 'estimated_duration'].includes(field)) {
        processedValue = Number(value)
      }
      
      // Handle array fields
      if (field === 'topics' && typeof value === 'string') {
        processedValue = value.split(',').map(t => t.trim())
      }
      
      setEditForm({ ...editForm, [field]: processedValue })
    }
  }

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      not_started: "bg-gray-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
      on_hold: "bg-yellow-500",
      cancelled: "bg-red-500"
    } as const
    return colors[status]
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: "bg-gray-500",
      medium: "bg-blue-500",
      high: "bg-yellow-500",
      critical: "bg-red-500"
    } as const
    return colors[priority]
  }

  const addTask = async (newTask: TaskFormValues) => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add task')
      }

      const addedTask = await response.json()
      setTasks(prevTasks => [...prevTasks, addedTask])
    } catch (error) {
      console.error('Error adding task:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <div className="border rounded-lg p-6 col-span-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Today's Tasks</h2>
          {sortConfigs.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Sorting by: {sortConfigs.map((config, i) => (
                <span key={config.field}>
                  {i > 0 && ", "}
                  {config.field} ({config.direction})
                </span>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setSortConfigs([])}
              >
                Clear Sort
              </Button>
            </div>
          )}
        </div>
        <AddTaskDialog onAddTask={addTask} />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">Done</TableHead>
              <TableHead className="min-w-[200px] group">
                <SortableColumn field="task" sortConfigs={sortConfigs} onSort={handleSort}>
                  Task
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="order" sortConfigs={sortConfigs} onSort={handleSort}>
                  Order
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="status" sortConfigs={sortConfigs} onSort={handleSort}>
                  Status
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="progress" sortConfigs={sortConfigs} onSort={handleSort}>
                  Progress
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="priority" sortConfigs={sortConfigs} onSort={handleSort}>
                  Priority
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="type" sortConfigs={sortConfigs} onSort={handleSort}>
                  Type
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="level" sortConfigs={sortConfigs} onSort={handleSort}>
                  Level
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="section" sortConfigs={sortConfigs} onSort={handleSort}>
                  Section
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="category" sortConfigs={sortConfigs} onSort={handleSort}>
                  Category
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="subcategory" sortConfigs={sortConfigs} onSort={handleSort}>
                  Subcategory
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="technology" sortConfigs={sortConfigs} onSort={handleSort}>
                  Technology
                </SortableColumn>
              </TableHead>
              <TableHead className="min-w-[150px]">Topics</TableHead>
              <TableHead className="group">
                <SortableColumn field="source" sortConfigs={sortConfigs} onSort={handleSort}>
                  Source
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="estimated_duration" sortConfigs={sortConfigs} onSort={handleSort}>
                  Est. Duration
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="actual_duration" sortConfigs={sortConfigs} onSort={handleSort}>
                  Actual Duration
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="start_date" sortConfigs={sortConfigs} onSort={handleSort}>
                  Start Date
                </SortableColumn>
              </TableHead>
              <TableHead className="group">
                <SortableColumn field="end_date" sortConfigs={sortConfigs} onSort={handleSort}>
                  End Date
                </SortableColumn>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.done}
                    onCheckedChange={(checked) => toggleTaskDone(task.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.task}
                      onChange={(e) => handleEditChange('task', e.target.value)}
                      className="w-full"
                    />
                  ) : task.task}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="number"
                      value={editForm?.order}
                      onChange={(e) => handleEditChange('order', e.target.value)}
                      className="w-20"
                    />
                  ) : task.order}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Select
                      value={editForm?.status}
                      onValueChange={(value) => handleEditChange('status', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>{editForm?.status.replace('_', ' ')}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white`}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm?.progress}
                      onChange={(e) => handleEditChange('progress', e.target.value)}
                      className="w-20"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="w-[60px]" />
                      <span className="text-sm">{task.progress}%</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Select
                      value={editForm?.priority}
                      onValueChange={(value) => handleEditChange('priority', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue>{editForm?.priority}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-white`}>
                      {task.priority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Select
                      value={editForm?.type}
                      onValueChange={(value) => handleEditChange('type', value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>{editForm?.type}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="implementation">Implementation</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : task.type}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Select
                      value={editForm?.level}
                      onValueChange={(value) => handleEditChange('level', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>{editForm?.level}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : task.level}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.section}
                      onChange={(e) => handleEditChange('section', e.target.value)}
                      className="w-full"
                    />
                  ) : task.section}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.category}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                      className="w-full"
                    />
                  ) : task.category}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.subcategory}
                      onChange={(e) => handleEditChange('subcategory', e.target.value)}
                      className="w-full"
                    />
                  ) : task.subcategory}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.technology}
                      onChange={(e) => handleEditChange('technology', e.target.value)}
                      className="w-full"
                    />
                  ) : task.technology}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.topics.join(', ')}
                      onChange={(e) => handleEditChange('topics', e.target.value.split(',').map(t => t.trim()))}
                      className="w-full"
                      placeholder="Comma-separated topics"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {task.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      value={editForm?.source}
                      onChange={(e) => handleEditChange('source', e.target.value)}
                      className="w-full"
                    />
                  ) : task.source}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="number"
                      value={editForm?.estimated_duration}
                      onChange={(e) => handleEditChange('estimated_duration', e.target.value)}
                      className="w-20"
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.estimated_duration}h
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="number"
                      value={editForm?.actual_duration || ''}
                      onChange={(e) => handleEditChange('actual_duration', e.target.value || null)}
                      className="w-20"
                      placeholder="Hours"
                    />
                  ) : task.actual_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.actual_duration}h
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="date"
                      value={editForm?.start_date || ''}
                      onChange={(e) => handleEditChange('start_date', e.target.value || null)}
                      className="w-32"
                    />
                  ) : task.start_date || '-'}
                </TableCell>
                <TableCell>
                  {editingTask === task.id ? (
                    <Input
                      type="date"
                      value={editForm?.end_date || ''}
                      onChange={(e) => handleEditChange('end_date', e.target.value || null)}
                      className="w-32"
                    />
                  ) : task.end_date || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {editingTask === task.id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={saveEditing}>
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => startEditing(task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value: string) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue>{rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {start + 1}–{Math.min(end, tasks.length)} of {tasks.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 