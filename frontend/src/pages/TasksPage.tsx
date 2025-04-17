// TasksPage.tsx
import { useState, useEffect, useCallback } from "react"
import { ColumnDef, SortingState, VisibilityState, FilterFn, ColumnFiltersState, OnChangeFn, PaginationState } from "@tanstack/react-table"
import { DataTableWidget, EditModeRenderer } from "@/components/widgets/DataTableWidget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Clock, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { capitalizeWords } from "@/lib/utils"
import { StatusEnum } from "@/types/enums"
import { PriorityEnum } from "@/types/enums"
import { Button } from "@/components/ui/button"
import { TaskSheet } from "@/components/ui/task-sheet"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Task } from "@/components/data/schema"
import { getStatusColor, getPriorityColor } from "@/styles/style"
import React from "react"
import { usePageTitle } from '@/hooks/usePageTitle'
import { TasksWidget } from "@/components/widgets/TasksWidget"
import NewWidget from "@/components/widgets/NewWidget"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { TaskForm, taskFormSchema } from "@/components/data/schema"


/*******************
  ADD NEW TASK DIALOG
********************/
export function ShowAddTaskDialog({ onAddTask, disabled }: { onAddTask: (task: TaskForm) => void, disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<TaskForm>({
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

  const onSubmit = async (data: TaskForm) => {
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


export const saveTask = async (newTask: TaskForm) => {
  try {
    const response = await fetch('/api/tasks', {
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


/*******************
  INITIAL VISIBLE COLUMNS
********************/
const initialVisibleColumns = {
  id: false,                  // ✓ ID  
  task_id: true,              // ✓ Task ID
  task: true,                 // ✓ Task
  technology: true,           // ✓ Technology
  subcategory: true,         // Subcategory
  category: true,             // ✓ Category
  topics: false,              // Topics
  section: false,             // Section
  source: true,               // ✓ Source
  level: false,               // Level
  type: true,                 // ✓ Type
  status: true,               // ✓ Status
  priority: true,             // ✓ Priority
  progress: false,            // Progress
  order: false,               // Order
  due_date: true,            // Due Date
  start_date: false,           // Start Date
  end_date: false,            // End Date
  estimated_duration: false,   // ✓ Est. Duration
  actual_duration: false,     // Actual Duration
  done: false                 // Done
}



export default function TasksPage() {
  // Set page title
  usePageTitle('Tasks')

  /*******************
    STATE VARIABLES
  ********************/
  // Fetching Data
  const [rows, setRows] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedRows, setHasFetchedRows] = useState(false);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibilityState>(initialVisibleColumns);

  // Table Pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Row Filter
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);

  // Row Sorting
  const [sortConfigs, setSortConfigs] = useState<SortingState>([]);

  // Row Selection
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRow, setSelectedRow] = useState<Task | null>(null);  

  // Row Sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // Row Editing
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Task | null>(null);

  // Fetching Options
  const [hasFetchedOptions, setHasFetchedOptions] = useState(false);
  const [priorityOptions, setPriorityOptions] = useState<{ name: string; id: number }[]>([]);
  const [typeOptions, setTypeOptions] = useState<{ name: string; id: number }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ name: string; id: number }[]>([]);
  const [sourceOptions, setSourceOptions] = useState<{ name: string; id: number }[]>([]);
  const [levelOptions, setLevelOptions] = useState<{ name: string; id: number }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ name: string; id: number }[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ name: string; id: number }[]>([]);
  const [technologyOptions, setTechnologyOptions] = useState<{ name: string; id: number }[]>([]);



  /*******************
    COLUMN DEFINITIONS
  ********************/
  const columns: ColumnDef<Task>[] = [
    { accessorKey: "task_id", header: "Task ID", cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleRowClick(row.original)}
        >
          {row.original.task_id}
        </Button>
    )},
    { accessorKey: "task", header: "Task" },
    { accessorKey: "technology", header: "Technology" },
    { accessorKey: "subcategory", header: "Subcategory" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "topics", header: "Topics", cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.topics.map((topic, index) => (
          <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">
            {topic}
          </Badge>
        ))}
      </div>
    )},
    { accessorKey: "section", header: "Section" },
    { accessorKey: "source", header: "Source", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.source)}</span>
    )},
    { accessorKey: "level", header: "Level", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.level)}</span>
    )},
    { accessorKey: "type", header: "Type", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.type)}</span>
    )},
    { accessorKey: "estimated_duration", header: "Est. Duration", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{row.original.estimated_duration}h</span>
      </div>
    )},
    { accessorKey: "actual_duration", header: "Actual Duration", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{row.original.actual_duration}h</span>
      </div>
    )},
    { accessorKey: "status", header: "Status", 
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }) as FilterFn<Task>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getStatusColor(row.original.status as StatusEnum)} text-white`}>
          {capitalizeWords(row.original.status.replace('_', ' '))}
        </Badge>
      )
    },
    { accessorKey: "priority", header: "Priority", 
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }) as FilterFn<Task>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getPriorityColor(row.original.priority as PriorityEnum)} text-white`}>
          {capitalizeWords(row.original.priority)}
        </Badge>
      )
    },
    { accessorKey: "progress", header: "Progress", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={row.original.progress} className="w-[60px]" />
        <span className="text-sm">{row.original.progress}%</span>
      </div>
    )},
    { accessorKey: "order", header: "Order" },
    { accessorKey: "due_date", header: "Due Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.due_date)}</span>
    }}, 
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.start_date)}</span>
    }},
    { accessorKey: "end_date", header: "End Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.end_date)}</span>
    }},
  ]



  /*******************
    COLUMN VISIBILITY 
  ********************/
  const columnOptions = columns.map(column => ({
    accessorKey: (column as any).accessorKey,
    header: typeof column.header === 'string' ? column.header : 'Column'
  }))



  /*******************
    ROW FILTER CONFIGURATIONS
  ********************/
  const filterConfigs = [
    {
      field: "status",
      label: "Status",
      options: statusOptions,
      selected: selectedStatus,
      onSelect: setSelectedStatus
    },
    {
      field: "priority",
      label: "Priority",
      options: priorityOptions,
      selected: selectedPriority,
      onSelect: setSelectedPriority
    }
  ]

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFilters((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setPagination((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  };

  // Update column filters when search query or filter configs change
  React.useEffect(() => {
    const filters: ColumnFiltersState = []

    // Add search filter
    if (searchQuery) {
      filters.push({
        id: 'task',
        value: searchQuery,
      })
    }

    // Add status filter
    const statusConfig = filterConfigs?.find(config => config.field === 'status')
    if (statusConfig?.selected.length) {
      filters.push({
        id: 'status',
        value: statusConfig.selected,
      })
    }

    // Add priority filter
    const priorityConfig = filterConfigs?.find(config => config.field === 'priority')
    if (priorityConfig?.selected.length) {
      filters.push({
        id: 'priority',
        value: priorityConfig.selected,
      })
    }

    setColumnFilters((prev) => {
      const next = filters;
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  }, [searchQuery, selectedStatus, selectedPriority]);


  
  /***********************
    PAGE LOAD
  ***********************/
  // Fetch Options
  const fetchOptions = async () => {
    try {
      const [statusesRes, prioritiesRes] = await Promise.all([
        fetch('/api/tasks/statuses'),
        fetch('/api/tasks/priorities')
      ]);

      if (!statusesRes.ok || !prioritiesRes.ok) {
        throw new Error('Failed to fetch status or priority options');
      }

      const [statuses, priorities] = await Promise.all([
        statusesRes.json(),
        prioritiesRes.json()
      ]);

      setStatusOptions(statuses);
      setPriorityOptions(priorities);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast({
        title: "Error",
        description: "Failed to load status or priority options.",
        variant: "destructive",
      });
    }
  };

  // Fetch Row Data
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setRows(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load tasks.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch Row Data on Page Load
  useEffect(() => {
    if (!hasFetchedOptions) {
      fetchOptions();
      setHasFetchedOptions(true);
    }
    if (!hasFetchedRows) {
      fetchRows();
      setHasFetchedRows(true);
    }
  }, []);




  /*******************
    ADDITIONAL FUNCTIONS
  ********************/
  // Add a function to fetch subcategories for a specific category
  const fetchSubcategoryOptionsForCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/tasks/subcategories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategory options');
      }
      const data = await response.json();
      setSubcategoryOptions(data);
      return data;
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
  const fetchTechnologyOptionsForSubcategory = async (subcategoryId: string) => {
    try {
      const response = await fetch(`/api/tasks/technologies/${subcategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }
      const data = await response.json();
      setTechnologyOptions(data);
      return data;
    } catch (error) {
      console.error('Error fetching technologies:', error);
      toast({
        title: "Error",
        description: "Failed to load technologies for the selected subcategory.",
        variant: "destructive",
      });
    }
  };




  /***********************
    ROW EDITING
  ***********************/
  // Start Editing
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
        fetch('/api/tasks/priorities'),
        fetch('/api/tasks/statuses'),
        fetch('/api/tasks/types'),
        fetch('/api/tasks/levels'),
        fetch('/api/tasks/sources'),
        fetch('/api/tasks/categories')
      ])

      if (!prioritiesRes.ok || !statusesRes.ok || !typesRes.ok || !levelsRes.ok || !sourcesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch some options')
      }
      
      // Dropdown Options
      const [
        priorityOptions,
        statusOptions,
        typeOptions,
        levelOptions,
        sourceOptions,
        categoryOptions
      ] = await Promise.all([
        prioritiesRes.json(),
        statusesRes.json(),
        typesRes.json(),
        levelsRes.json(),
        sourcesRes.json(),
        categoriesRes.json()
      ])

      // Set the options globally
      setPriorityOptions(priorityOptions)
      setStatusOptions(statusOptions)
      setTypeOptions(typeOptions)
      setLevelOptions(levelOptions)
      setSourceOptions(sourceOptions)
      setCategoryOptions(categoryOptions)

      
      // Find all IDs that match the task's current values
      const priorityId = priorityOptions.find((p: { id: number; name: string }) => p.name === task.priority)?.id.toString()
      const statusId = statusOptions.find((s: { id: number; name: string }) => s.name === task.status)?.id.toString()
      const typeId = typeOptions.find((t: { id: number; name: string }) => t.name === task.type)?.id.toString()
      const levelId = levelOptions.find((l: { id: number; name: string }) => l.name === task.level)?.id.toString()
      const sourceId = sourceOptions.find((s: { id: number; name: string }) => s.name === task.source)?.id.toString()
      const categoryId = categoryOptions.find((c: { id: number; name: string }) => c.name === task.category)?.id.toString()


      setEditingRow(task.id)
      
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
        const fetchedSubcategoryOptions = await fetchSubcategoryOptionsForCategory(categoryId);
        setSubcategoryOptions(fetchedSubcategoryOptions);

        const subcategoryId = fetchedSubcategoryOptions.find((s: { id: number; name: string }) => 
          s.name === task.subcategory
        )?.id.toString();
          
        if (subcategoryId) {
          // Update form with subcategory
          setEditForm({
            ...initialEditForm,
            subcategory: subcategoryId
          });
            
          // Now fetch technologies based on the subcategory
          const fetchedTechOptions = await fetchTechnologyOptionsForSubcategory(subcategoryId);
          setTechnologyOptions(fetchedTechOptions);
            
          // Once technologies are loaded, find the matching technology ID
          const technologyId = fetchedTechOptions.find((t: { id: number; name: string }) => 
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
    }catch (error) {
      console.error('Error fetching options:', error)
      toast({
        title: "Error",
        description: "Failed to load some options. Some fields may be unavailable.",
        variant: "destructive",
      })
    }
  }


  // Edit Change
  const onEditChange = (field: keyof Task, value: Task[keyof Task]) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev)
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
        fetchSubcategoryOptionsForCategory(value);
        
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
        fetchTechnologyOptionsForSubcategory(value);
        
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


  // Save Edit
  const onSaveEdit = async () => {
    if (editForm) {
      await handleRowUpdate(editForm)
    }
  }


  // Update Row
  const handleRowUpdate = async (updatedRow: Task) => {
    setIsLoading(true);

    // Destructure all dropdown fields out and rename remaining fields
    const { priority, status, type, level, source, category, subcategory, technology, ...rest } = updatedRow;
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

    try {
      const response = await fetch(`/api/tasks/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const data = await response.json();
      setRows(rows.map(row => row.id === data.id ? data : row));
      setEditingRow(null);
      setEditForm(null);

      toast({
        title: "Task Updated",
        description: "The task has been successfully updated.",
        duration: 3000,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Cancel Edit
  const onCancelEdit = () => {
    setEditingRow(null)
    setEditForm(null)
  }


  // Delete Row
  const handleRowDelete = async (rowId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${rowId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setRows(rows.filter(row => row.id !== rowId));
      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
        duration: 3000,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };




  /***********************
    ROW INTERACTION
  ***********************/
  const handleRowClick = useCallback((row: Task) => {
    if (editingRow) return // Don't open sheet while editing
    setSelectedRow(row)
    setSheetOpen(true)
  }, [editingRow])


  

  /*******************
    RENDER CELLS IN EDIT-MODE
  ********************/
  const editModeRenderers: EditModeRenderer<Task> = {
    technology: (value, onChange) => (
      <Select
        value={ technologyOptions.find((t) => t.name === value || t.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {technologyOptions.map(technology => (
            <SelectItem key={technology.id} value={technology.id.toString()}>{technology.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    subcategory: (value) => (
      <Select
        value={ subcategoryOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(value) => handleEditChange('subcategory', value)}
        //onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {subcategoryOptions.map(subcategory => (
            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>{subcategory.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    category: (value) => (
      <Select
        value={ categoryOptions.find((c) => c.name === value || c.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(value) => handleEditChange('category', value)}
        //onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map(category => (
            <SelectItem key={category.id} value={category.id.toString()}>{capitalizeWords(category.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    source: (value, onChange) => (  
      <Select
        value={ sourceOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {sourceOptions.map(source => (
            <SelectItem key={source.id} value={source.id.toString()}>{capitalizeWords(source.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    level: (value, onChange) => (
      <Select
        value={ levelOptions.find((l) => l.name === value || l.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {levelOptions.map(level => (
            <SelectItem key={level.id} value={level.id.toString()}>{capitalizeWords(level.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    type: (value, onChange) => (
      <Select
        value={ typeOptions.find((t) => t.name === value || t.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map(type => (
            <SelectItem key={type.id} value={type.id.toString()}>{capitalizeWords(type.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    status: (value, onChange) => (
      <Select
        value={ statusOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(status => (
            <SelectItem key={status.id} value={status.id.toString()}>{capitalizeWords(status.name.replace('_', ' '))}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    priority: (value, onChange) => (
      <Select
        value={ priorityOptions.find((p) => p.name === value || p.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map(priority => (
            <SelectItem key={priority.id} value={String(priority.id)}>{capitalizeWords(priority.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    progress: (value, onChange) => (
      <Input
        type="number"
        min="0"
        max="100"
        value={typeof value === 'number' ? value : 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-[70px]"
      />  
    ),
    due_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
        <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    }, 
    start_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
      <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    },
    end_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
      <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    }
  }




  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CheckSquare className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>
      
      <div className="grid gap-6">
        <TasksWidget tasks={rows} />
      </div>
      <br />
      <div className="grid gap-6">
        {/*<TempWidget 
          tasks={rows} 
          onTaskUpdate={handleRowUpdate}
        />*/}
      </div>
      <br />
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">New Widget</h2>
        <NewWidget tasks={rows} />
      </div>
      <br />
      <div className="grid gap-6">
        <DataTableWidget
          title=""
          data={rows}
          isLoading={isLoading}
          columns={columns}
          columnOptions={columnOptions}
          visibleColumns={visibleColumns}
          columnFilters={columnFilters}
          onColumnVisibilityChange={setVisibleColumns}
          onColumnFiltersChange={handleColumnFiltersChange}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          filterConfigs={filterConfigs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortConfigs={sortConfigs}
          onSortChange={setSortConfigs}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          editForm={editForm}
          editModeRenderers={editModeRenderers}
          nonEditableColumns={['task_id']}
          onStartEdit={startEditing}
          onEditChange={onEditChange}
          editingRow={editingRow}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDeleteRow={handleRowDelete}
          showCheckboxes={true}
          showActions={true}
        />
      </div>

      <TaskSheet
        task={selectedRow}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}