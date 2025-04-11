import { useState, useEffect, useMemo, useTransition, useCallback } from "react"
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
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  X as CrossIcon,
  LayoutGrid,
  Clock,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { VisibilityState } from "@tanstack/react-table"
import { TaskSheet } from "../ui/task-sheet"
import { Task } from "@/components/data/schema"
import { useToast } from "@/components/ui/use-toast"
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

interface NewWidgetProps {
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
function AddTaskDialog({ onAddTask, disabled }: { onAddTask: (task: TaskFormValues) => void, disabled?: boolean }) {
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
        <Button variant="outline" size="sm" disabled={disabled}>
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

export function NewWidget({ tasks: initialTasks }: NewWidgetProps) {
  //console.log('(NewWidget) Initial tasks in widget:', initialTasks)
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Task | null>(null)
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string[]>([])
  const [priorities, setPriorities] = useState<Array<{ id: number; name: string }>>([])
  const [statuses, setStatuses] = useState<Array<{ id: number; name: string }>>([])
  const [types, setTypes] = useState<Array<{ id: number; name: string }>>([])
  const [levels, setLevels] = useState<Array<{ id: number; name: string }>>([])
  const [sources, setSources] = useState<Array<{ id: number; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [subcategories, setSubcategories] = useState<Array<{ id: number; name: string }>>([])
  const [technologies, setTechnologies] = useState<Array<{ id: number; name: string }>>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    task_id: true,              // ✓ Task ID
    task: true,                 // ✓ Task
    technology: true,           // ✓ Technology
    subcategory: false,         // Subcategory
    category: true,             // ✓ Category
    section: false,             // Section
    source: true,               // ✓ Source
    status: true,               // ✓ Status
    priority: true,             // ✓ Priority
    type: true,                 // ✓ Type
    level: false,               // Level
    progress: false,            // Progress
    order: false,               // Order
    estimated_duration: true,   // ✓ Est. Duration
    actual_duration: false,     // Actual Duration
    start_date: false,          // Start Date
    end_date: false,            // End Date
    done: false                 // Done
  })
  const [isPending, startTransition] = useTransition()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Initialize tasks only once
  useEffect(() => {
    if (!tasks.length && initialTasks?.length) {
      setTasks(initialTasks)
    }
  }, [initialTasks])

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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(task.status)
      const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(task.priority)
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchQuery, selectedStatus, selectedPriority])

  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage)
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const sortedTasks = sortTasks(filteredTasks)
  const currentTasks = sortedTasks.slice(start, end)

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

  // Add a function to fetch subcategories for a specific category
  const fetchSubcategoriesForCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/subcategories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories for the selected category.",
        variant: "destructive",
      });
    }
  };

  // Add a function to fetch technologies for a specific subcategory
  const fetchTechnologiesForSubcategory = async (subcategoryId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/technologies/${subcategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }
      const data = await response.json();
      setTechnologies(data);
    } catch (error) {
      console.error('Error fetching technologies:', error);
      toast({
        title: "Error",
        description: "Failed to load technologies for the selected subcategory.",
        variant: "destructive",
      });
    }
  };

  const startEditing = async (task: Task) => {
    try {
      // Fetch all dynamic data in parallel
      const [
        prioritiesRes,
        statusesRes,
        typesRes,
        levelsRes,
        sourcesRes,
        categoriesRes
      ] = await Promise.all([
        fetch('http://localhost:8000/api/tasks/priorities'),
        fetch('http://localhost:8000/api/tasks/statuses'),
        fetch('http://localhost:8000/api/tasks/types'),
        fetch('http://localhost:8000/api/tasks/levels'),
        fetch('http://localhost:8000/api/tasks/sources'),
        fetch('http://localhost:8000/api/tasks/categories')
      ])

      if (!prioritiesRes.ok || !statusesRes.ok || !typesRes.ok || !levelsRes.ok || !sourcesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch some options')
      }

      const [
        prioritiesData,
        statusesData,
        typesData,
        levelsData,
        sourcesData,
        categoriesData
      ] = await Promise.all([
        prioritiesRes.json(),
        statusesRes.json(),
        typesRes.json(),
        levelsRes.json(),
        sourcesRes.json(),
        categoriesRes.json()
      ])

      setPriorities(prioritiesData)
      setStatuses(statusesData)
      setTypes(typesData)
      setLevels(levelsData)
      setSources(sourcesData)
      setCategories(categoriesData)

      // Find all IDs that match the task's current values
      const priorityId = prioritiesData.find((p: { id: number; name: string }) => p.name === task.priority)?.id.toString()
      const statusId = statusesData.find((s: { id: number; name: string }) => s.name === task.status)?.id.toString()
      const typeId = typesData.find((t: { id: number; name: string }) => t.name === task.type)?.id.toString()
      const levelId = levelsData.find((l: { id: number; name: string }) => l.name === task.level)?.id.toString()
      const sourceId = sourcesData.find((s: { id: number; name: string }) => s.name === task.source)?.id.toString()
      const categoryId = categoriesData.find((c: { id: number; name: string }) => c.name === task.category)?.id.toString()

      setEditingTask(task.id)
      
      // Set initial form state without subcategory and technology
      const initialEditForm = { 
        ...task,
        priority: priorityId || task.priority,
        status: statusId || task.status,
        type: typeId || task.type,
        level: levelId || task.level,
        source: sourceId || task.source,
        category: categoryId || task.category
      };
      
      setEditForm(initialEditForm);
      
      // Fetch subcategories based on the task's category
      if (categoryId) {
        await fetchSubcategoriesForCategory(categoryId);
        
        // Once subcategories are loaded, find the matching subcategory ID
        const subcategoriesRes = await fetch(`http://localhost:8000/api/tasks/subcategories/${categoryId}`);
        if (subcategoriesRes.ok) {
          const subcategoriesData = await subcategoriesRes.json();
          const subcategoryId = subcategoriesData.find((s: { id: number; name: string }) => 
            s.name === task.subcategory
          )?.id.toString();
          
          if (subcategoryId) {
            // Update form with subcategory
            setEditForm({
              ...initialEditForm,
              subcategory: subcategoryId
            });
            
            // Now fetch technologies based on the subcategory
            await fetchTechnologiesForSubcategory(subcategoryId);
            
            // Once technologies are loaded, find the matching technology ID
            const technologiesRes = await fetch(`http://localhost:8000/api/tasks/technologies/${subcategoryId}`);
            if (technologiesRes.ok) {
              const technologiesData = await technologiesRes.json();
              const technologyId = technologiesData.find((t: { id: number; name: string }) => 
                t.name === task.technology
              )?.id.toString();
              
              if (technologyId) {
                // Finally update the form with technology
                setEditForm({
                  ...initialEditForm,
                  subcategory: subcategoryId,
                  technology: technologyId
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching options:', error)
      toast({
        title: "Error",
        description: "Failed to load some options. Some fields may be unavailable.",
        variant: "destructive",
      })
    }
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setEditForm(null)
  }

  // Update handleEditChange to fetch technologies when subcategory changes
  const handleEditChange = (field: keyof Task, value: string | number | boolean | string[] | Date | null) => {
    if (editForm) {
      let processedValue: any = value;
      
      // Handle numeric fields
      if (['order', 'progress', 'estimated_duration'].includes(field)) {
        processedValue = Number(value);
      }
      
      // Handle array fields
      if (field === 'topics' && typeof value === 'string') {
        processedValue = value.split(',').map(t => t.trim());
      }
      
      // Handle boolean fields
      if (field === 'done') {
        processedValue = Boolean(value);
      }

      // Handle date fields
      if (['start_date', 'end_date'].includes(field)) {
        processedValue = value instanceof Date ? value : null;
      }
      
      // When category changes, fetch related subcategories
      if (field === 'category' && typeof value === 'string') {
        fetchSubcategoriesForCategory(value);
        
        // Reset subcategory and technology when category changes
        setEditForm({ 
          ...editForm, 
          [field]: processedValue,
          subcategory: "",
          technology: ""
        });
        return;
      }
      
      // When subcategory changes, fetch related technologies
      if (field === 'subcategory' && typeof value === 'string') {
        fetchTechnologiesForSubcategory(value);
        
        // Reset technology when subcategory changes
        setEditForm({ 
          ...editForm, 
          [field]: processedValue,
          technology: ""
        });
        return;
      }
      
      setEditForm({ ...editForm, [field]: processedValue });
    }
  };

  const saveEditing = async () => {
    if (editForm) {
      try {
        // Destructure all dropdown fields out and rename remaining fields
        const { priority, status, type, level, source, category, subcategory, technology, ...rest } = editForm;
        const payload = {
          ...rest,
          priority_id: priority,
          status_id: status,
          type_id: type,
          level_id: level,
          source_id: source,
          category_id: category,
          subcategory_id: subcategory,
          technology_id: technology,
        };

        const response = await fetch(`http://localhost:8000/api/tasks/${editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update task');
        }

        const updatedTask = await response.json();
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setEditingTask(null);
        setEditForm(null);
        console.log('Task Updated!')
        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          //description: error instanceof Error ? error.message : "Failed to update the task. Please try again.",
          description: "Failed to update the task. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  type StatusType = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  type PriorityType = 'low' | 'medium' | 'high' | 'critical'

  const getStatusColor = (status: string) => {
    const colors: Record<StatusType, string> = {
      'not_started': "bg-gray-500",
      'in_progress': "bg-blue-500",
      'completed': "bg-green-500",
      'on_hold': "bg-yellow-500",
      'cancelled': "bg-red-500"
    }
    return colors[status as StatusType] || "bg-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<PriorityType, string> = {
      'low': "bg-gray-500",
      'medium': "bg-blue-500",
      'high': "bg-yellow-500",
      'critical': "bg-red-500"
    }
    return colors[priority as PriorityType] || "bg-gray-500"
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

  // Add reset filters function
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedStatus([])
    setSelectedPriority([])
  }

  // Add handleTaskClick function
  const handleTaskClick = useCallback((task: Task) => {
    if (editingTask) return // Don't open sheet while editing
    setSelectedTask(task)
    setSheetOpen(true)
  }, [editingTask])

  return (
    <div className="border rounded-lg p-6 col-span-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
              disabled={!!editingTask}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                onClick={() => setSearchQuery("")}
                disabled={!!editingTask}
              >
                <CrossIcon className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                <Plus className="mr-2 h-4 w-4" />
                Status
                {selectedStatus.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <span className="text-xs">{selectedStatus.length}</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status.id}
                  checked={selectedStatus.includes(status.name)}
                  onCheckedChange={(checked) => {
                    startTransition(() => {
                      checked
                        ? setSelectedStatus([...selectedStatus, status.name])
                        : setSelectedStatus(selectedStatus.filter((value) => value !== status.name))
                    })
                  }}
                >
                  {status.name.replace('_', ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                <Plus className="mr-2 h-4 w-4" />
                Priority
                {selectedPriority.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <span className="text-xs">{selectedPriority.length}</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {priorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority.id}
                  checked={selectedPriority.includes(priority.name)}
                  onCheckedChange={(checked) => {
                    startTransition(() => {
                      checked
                        ? setSelectedPriority([...selectedPriority, priority.name])
                        : setSelectedPriority(selectedPriority.filter((value) => value !== priority.name))
                    })
                  }}
                >
                  {priority.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-dashed"
            onClick={resetFilters}
            disabled={(!searchQuery && selectedStatus.length === 0 && selectedPriority.length === 0) || !!editingTask}
          >
            Reset
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={columnVisibility["task_id"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    task_id: value,
                  }))
                }
              >
                Task ID
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["task"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    task: value,
                  }))
                }
              >
                Task
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["technology"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    technology: value,
                  }))
                }
              >
                Technology
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["subcategory"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    subcategory: value,
                  }))
                }
              >
                Subcategory
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["category"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              >
                Category
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["section"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    section: value,
                  }))
                }
              >
                Section
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["source"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    source: value,
                  }))
                }
              >
                Source
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["status"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["priority"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    priority: value,
                  }))
                }
              >
                Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["type"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["level"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    level: value,
                  }))
                }
              >
                Level
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["progress"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    progress: value,
                  }))
                }
              >
                Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["order"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    order: value,
                  }))
                }
              >
                Order
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["estimated_duration"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    estimated_duration: value,
                  }))
                }
              >
                Est. Duration
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["actual_duration"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    actual_duration: value,
                  }))
                }
              >
                Actual Duration
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["start_date"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    start_date: value,
                  }))
                }
              >
                Start Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["end_date"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    end_date: value,
                  }))
                }
              >
                End Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility["done"]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    done: value,
                  }))
                }
              >
                Done
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AddTaskDialog onAddTask={addTask} disabled={!!editingTask} />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={currentTasks.length > 0 && selectedRows.length === currentTasks.length}
                  onCheckedChange={(checked: boolean) => {
                    setSelectedRows(checked ? currentTasks.map(t => t.id) : [])
                  }}
                  aria-label="Select all rows"
                />
              </TableHead>
              {columnVisibility["task_id"] && (
                <TableHead className="group">
                  <SortableColumn field="task_id" sortConfigs={sortConfigs} onSort={handleSort}>
                    Task ID
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["task"] && (
                <TableHead className="min-w-[200px] group">
                  <SortableColumn field="task" sortConfigs={sortConfigs} onSort={handleSort}>
                    Task
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["technology"] && (
                <TableHead className="group">
                  <SortableColumn field="technology" sortConfigs={sortConfigs} onSort={handleSort}>
                    Technology
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["subcategory"] && (
                <TableHead className="group">
                  <SortableColumn field="subcategory" sortConfigs={sortConfigs} onSort={handleSort}>
                    Subcategory
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["category"] && (
                <TableHead className="group">
                  <SortableColumn field="category" sortConfigs={sortConfigs} onSort={handleSort}>
                    Category
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["section"] && (
                <TableHead className="group">
                  <SortableColumn field="section" sortConfigs={sortConfigs} onSort={handleSort}>
                    Section
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["source"] && (
                <TableHead className="group">
                  <SortableColumn field="source" sortConfigs={sortConfigs} onSort={handleSort}>
                    Source
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["type"] && (
                <TableHead className="group">
                  <SortableColumn field="type" sortConfigs={sortConfigs} onSort={handleSort}>
                    Type
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["estimated_duration"] && (
                <TableHead className="group">
                  <SortableColumn field="estimated_duration" sortConfigs={sortConfigs} onSort={handleSort}>
                    Est. Duration
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["status"] && (
                <TableHead className="group">
                  <SortableColumn field="status" sortConfigs={sortConfigs} onSort={handleSort}>
                    Status
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["priority"] && (
                <TableHead className="group">
                  <SortableColumn field="priority" sortConfigs={sortConfigs} onSort={handleSort}>
                    Priority
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["level"] && (
                <TableHead className="group">
                  <SortableColumn field="level" sortConfigs={sortConfigs} onSort={handleSort}>
                    Level
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["progress"] && (
                <TableHead className="group">
                  <SortableColumn field="progress" sortConfigs={sortConfigs} onSort={handleSort}>
                    Progress
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["order"] && (
                <TableHead className="group">
                  <SortableColumn field="order" sortConfigs={sortConfigs} onSort={handleSort}>
                    Order
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["actual_duration"] && (
                <TableHead className="group">
                  <SortableColumn field="actual_duration" sortConfigs={sortConfigs} onSort={handleSort}>
                    Actual Duration
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["start_date"] && (
                <TableHead className="group">
                  <SortableColumn field="start_date" sortConfigs={sortConfigs} onSort={handleSort}>
                    Start Date
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["end_date"] && (
                <TableHead className="group">
                  <SortableColumn field="end_date" sortConfigs={sortConfigs} onSort={handleSort}>
                    End Date
                  </SortableColumn>
                </TableHead>
              )}
              {columnVisibility["done"] && (
                <TableHead className="group">
                  <SortableColumn field="done" sortConfigs={sortConfigs} onSort={handleSort}>
                    Done
                  </SortableColumn>
                </TableHead>
              )}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(task.id)}
                    onCheckedChange={(checked: boolean) => {
                      setSelectedRows(prev =>
                        checked
                          ? [...prev, task.id]
                          : prev.filter(id => id !== task.id)
                      )
                    }}
                    aria-label={`Select task ${task.task}`}
                  />
                </TableCell>
                {columnVisibility["task_id"] && (
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal"
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.task_id}
                    </Button>
                  </TableCell>
                )}
                {columnVisibility["task"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        value={editForm?.task}
                        onChange={(e) => handleEditChange('task', e.target.value)}
                        className="w-full"
                      />
                    ) : task.task}
                  </TableCell>
                )}
                {columnVisibility["technology"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.technology}
                        onValueChange={(value) => handleEditChange('technology', value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue>
                            {technologies.find((t: { id: number; name: string }) => t.id.toString() === editForm?.technology)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {technologies.map((technology) => (
                            <SelectItem key={technology.id} value={technology.id.toString()}>
                              {technology.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.technology}
                  </TableCell>
                )}
                {columnVisibility["subcategory"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.subcategory}
                        onValueChange={(value) => handleEditChange('subcategory', value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue>
                            {subcategories.find((s: { id: number; name: string }) => s.id.toString() === editForm?.subcategory)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.subcategory}
                  </TableCell>
                )}
                {columnVisibility["category"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.category}
                        onValueChange={(value) => handleEditChange('category', value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue>
                            {categories.find((c: { id: number; name: string }) => c.id.toString() === editForm?.category)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.category}
                  </TableCell>
                )}
                {columnVisibility["section"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        value={editForm?.section}
                        onChange={(e) => handleEditChange('section', e.target.value)}
                        className="w-full"
                      />
                    ) : task.section}
                  </TableCell>
                )}
                {columnVisibility["source"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.source}
                        onValueChange={(value) => handleEditChange('source', value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue>
                            {sources.find((s: { id: number; name: string }) => s.id.toString() === editForm?.source)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source.id} value={source.id.toString()}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.source}
                  </TableCell>
                )}
                {columnVisibility["type"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.type}
                        onValueChange={(value) => handleEditChange('type', value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            {types.find((t: { id: number; name: string }) => t.id.toString() === editForm?.type)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.type}
                  </TableCell>
                )}
                {columnVisibility["estimated_duration"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={editForm?.estimated_duration}
                        onChange={(e) => handleEditChange('estimated_duration', parseInt(e.target.value))}
                        className="w-[80px]"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.estimated_duration}h
                      </div>
                    )}
                  </TableCell>
                )}
                {columnVisibility["status"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.status}
                        onValueChange={(value) => handleEditChange('status', value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            {statuses.find((s: { id: number; name: string }) => s.id.toString() === editForm?.status)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.id} value={status.id.toString()}>
                              {status.name.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </TableCell>
                )}
                {columnVisibility["priority"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.priority}
                        onValueChange={(value) => handleEditChange('priority', value)}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue>
                            {priorities.find((p: { id: number; name: string }) => p.id.toString() === editForm?.priority)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.id} value={priority.id.toString()}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                    )}
                  </TableCell>
                )}
                {columnVisibility["level"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Select
                        value={editForm?.level}
                        onValueChange={(value) => handleEditChange('level', value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            {levels.find((l: { id: number; name: string }) => l.id.toString() === editForm?.level)?.name ?? "Select"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : task.level}
                  </TableCell>
                )}
                {columnVisibility["progress"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm?.progress}
                        onChange={(e) => handleEditChange('progress', parseInt(e.target.value))}
                        className="w-[80px]"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="w-[60px]" />
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                    )}
                  </TableCell>
                )}
                {columnVisibility["order"] && <TableCell>{task.order}</TableCell>}
                {columnVisibility["actual_duration"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={editForm?.actual_duration || ''}
                        onChange={(e) => handleEditChange('actual_duration', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-[80px]"
                      />
                    ) : task.actual_duration ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.actual_duration}h
                      </div>
                    ) : '-'}
                  </TableCell>
                )}
                {columnVisibility["start_date"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        type="date"
                        value={editForm?.start_date ? new Date(editForm.start_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleEditChange('start_date', e.target.value ? new Date(e.target.value) : null)}
                        className="w-[130px]"
                      />
                    ) : task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}
                  </TableCell>
                )}
                {columnVisibility["end_date"] && (
                  <TableCell>
                    {editingTask === task.id ? (
                      <Input
                        type="date"
                        value={editForm?.end_date ? new Date(editForm.end_date).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleEditChange('end_date', e.target.value ? new Date(e.target.value) : null)}
                        className="w-[130px]"
                      />
                    ) : task.end_date ? new Date(task.end_date).toLocaleDateString() : '-'}
                  </TableCell>
                )}
                {columnVisibility["done"] && (
                  <TableCell>
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={(checked: boolean) => handleEditChange('done', checked)}
                      disabled={!editingTask}
                    />
                  </TableCell>
                )}
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
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {filteredTasks.length} row(s) selected
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value: string) => setRowsPerPage(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
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

          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <span>←</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <span>→</span>
            </Button>
          </div>
        </div>
      </div>

      <TaskSheet
        task={selectedTask}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}

export default NewWidget