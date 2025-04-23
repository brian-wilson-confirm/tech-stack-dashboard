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
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { TaskOld, taskOldFormSchema, TaskOldForm } from "@/components/data/schema"
import { getStatusColor, getPriorityColor } from "@/styles/style"
import React from "react"
import { usePageTitle } from '@/hooks/usePageTitle'
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
import { Textarea } from "@/components/ui/textarea"
import { TaskOldSheet } from "@/components/ui/taskold-sheet"


/*******************
  ADD NEW TASK DIALOG
********************/
function ShowAddTaskDialog({ onAddItem, disabled }: { onAddItem: (item: TaskOldForm) => Promise<any>, disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeOptions, setTypeOptions] = useState<{ name: string; id: number }[]>([])
  const [levelOptions, setLevelOptions] = useState<{ name: string; id: number }[]>([])
  const [statusOptions, setStatusOptions] = useState<{ name: string; id: number }[]>([])
  const [priorityOptions, setPriorityOptions] = useState<{ name: string; id: number }[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ name: string; id: number }[]>([])
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ name: string; id: number }[]>([])
  const [technologyOptions, setTechnologyOptions] = useState<{ name: string; id: number }[]>([])
  const [sourceOptions, setSourceOptions] = useState<{ name: string; id: number }[]>([])
  
  const form = useForm<TaskOldForm>({
    resolver: zodResolver(taskOldFormSchema),
    defaultValues: {
      task: "",
      description: "",
      technology_id: "",
      subcategory_id: "",
      category_id: "",
      order: 0,
      status_id: "1",
      progress: 0,
      priority_id: "1",
      type_id: "1",
      level_id: "1",
      section: "",
      topics: [],
      source_id: "",
      estimated_duration: 8,
      actual_duration: null,
      due_date: null,
      start_date: null,
      end_date: null,
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Fetch types, levels, statuses, priorities, categories, and sources when dialog opens
  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          const [typesRes, levelsRes, statusesRes, prioritiesRes, categoriesRes, sourcesRes] = await Promise.all([
            fetch('/api/tasksold/types'),
            fetch('/api/tasksold/levels'),
            fetch('/api/tasksold/statuses'),
            fetch('/api/tasksold/priorities'),
            fetch('/api/tasksold/categories'),
            fetch('/api/tasksold/sources')
          ])
          
          if (!typesRes.ok || !levelsRes.ok || !statusesRes.ok || !prioritiesRes.ok || !categoriesRes.ok || !sourcesRes.ok) {
            throw new Error('Failed to fetch options')
          }
          
          const [types, levels, statuses, priorities, categories, sources] = await Promise.all([
            typesRes.json(),
            levelsRes.json(),
            statusesRes.json(),
            prioritiesRes.json(),
            categoriesRes.json(),
            sourcesRes.json()
          ])
          
          setTypeOptions(types)
          setLevelOptions(levels)
          setStatusOptions(statuses)
          setPriorityOptions(priorities)
          setCategoryOptions(categories)
          setSourceOptions(sources)
        } catch (error) {
          console.error('Error fetching options:', error)
          toast({
            title: "Error",
            description: "Failed to load options.",
            variant: "destructive",
          })
        }
      }
      fetchOptions()
    }
  }, [open])

  // Fetch subcategories when category changes
  useEffect(() => {
    const categoryId = form.watch('category_id')
    if (categoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(`/api/tasksold/subcategories/${categoryId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch subcategories')
          }
          const data = await response.json()
          setSubcategoryOptions(data)
          // Reset subcategory and technology when category changes
          form.setValue('subcategory_id', '')
          form.setValue('technology_id', '')
        } catch (error) {
          console.error('Error fetching subcategories:', error)
          toast({
            title: "Error",
            description: "Failed to load subcategories.",
            variant: "destructive",
          })
        }
      }
      fetchSubcategories()
    } else {
      setSubcategoryOptions([])
    }
  }, [form.watch('category_id')])

  // Fetch technologies when subcategory changes
  useEffect(() => {
    const subcategoryId = form.watch('subcategory_id')
    if (subcategoryId) {
      const fetchTechnologies = async () => {
        try {
          const response = await fetch(`/api/tasksold/technologies/${subcategoryId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch technologies')
          }
          const data = await response.json()
          setTechnologyOptions(data)
          // Reset technology when subcategory changes
          form.setValue('technology_id', '')
        } catch (error) {
          console.error('Error fetching technologies:', error)
          toast({
            title: "Error",
            description: "Failed to load technologies.",
            variant: "destructive",
          })
        }
      }
      fetchTechnologies()
    } else {
      setTechnologyOptions([])
    }
  }, [form.watch('subcategory_id')])

  const onSubmit = async (data: TaskOldForm) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      await onAddItem(data)
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
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* 1. Basic Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Basic Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField control={form.control} name="task" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/*
                <FormField control={form.control} name="order" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />*/}
              </div>
            </div>

            {/* 2. Status & Metadata */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Metadata</h3>
              <div className="grid grid-cols-4 gap-4">
                <FormField control={form.control} name="type_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Type *</FormLabel>
                    <Select
                      value={typeOptions.find((t: { name: string; id: number }) => t.name === field.value || t.id.toString() === field.value?.toString())?.id.toString() ?? "1"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((type: { name: string; id: number }) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{capitalizeWords(type.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="level_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Level *</FormLabel>
                    <Select
                      value={levelOptions.find((l: { name: string; id: number }) => l.name === field.value || l.id.toString() === field.value?.toString())?.id.toString() ?? "1"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {levelOptions.map((level: { name: string; id: number }) => (
                          <SelectItem key={level.id} value={level.id.toString()}>{capitalizeWords(level.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Status *</FormLabel>
                    <Select
                      value={statusOptions.find((s: { name: string; id: number }) => s.name === field.value || s.id.toString() === field.value?.toString())?.id.toString() ?? "1"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status: { name: string; id: number }) => (
                          <SelectItem key={status.id} value={status.id.toString()}>{capitalizeWords(status.name.replace('_', ' '))}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="priority_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Priority *</FormLabel>
                    <Select 
                      value={statusOptions.find((s: { name: string; id: number }) => s.name === field.value || s.id.toString() === field.value?.toString())?.id.toString() ?? "1"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((status: { name: string; id: number }) => (
                          <SelectItem key={status.id} value={status.id.toString()}>{capitalizeWords(status.name.replace('_', ' '))}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* 3. Categorization */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Categorization</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="category_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Category *</FormLabel>
                    <Select
                      value={categoryOptions.find((c: { name: string; id: number }) => c.name === field.value || c.id.toString() === field.value?.toString())?.id.toString() ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category: { name: string; id: number }) => (
                          <SelectItem key={category.id} value={category.id.toString()}>{capitalizeWords(category.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="subcategory_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Subcategory *</FormLabel>
                    <Select
                      value={subcategoryOptions.find((s: { name: string; id: number }) => s.name === field.value || s.id.toString() === field.value?.toString())?.id.toString() ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset technology when subcategory changes
                        form.setValue('technology_id', '')
                      }}
                      disabled={!form.watch('category_id')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategoryOptions.map((subcategory: { name: string; id: number }) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>{capitalizeWords(subcategory.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="technology_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Technology *</FormLabel>
                    <Select
                      value={technologyOptions.find((t: { name: string; id: number }) => t.name === field.value || t.id.toString() === field.value?.toString())?.id.toString() ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                      disabled={!form.watch('subcategory_id')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {technologyOptions.map((technology: { name: string; id: number }) => (
                          <SelectItem key={technology.id} value={technology.id.toString()}>{capitalizeWords(technology.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* 4. Sources, Section, & Topics */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Sources & Topics</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="source_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source *</FormLabel>
                    <Select
                      value={sourceOptions.find((s: { name: string; id: number }) => s.name === field.value || s.id.toString() === field.value?.toString())?.id.toString() ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((source: { name: string; id: number }) => (
                          <SelectItem key={source.id} value={source.id.toString()}>{capitalizeWords(source.name)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="section" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="topics" render={({ field }) => (
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
                )} />
        </div>
        </div>

            {/* 5. Time & Progress */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Time & Progress</h3>
              <div className="grid grid-cols-3 gap-4">

                <FormField control={form.control} name="estimated_duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (hours)</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="actual_duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Duration (hours)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="due_date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Adding Task...
                  </>
                ) : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}



/*******************
  INITIAL VISIBLE COLUMNS
********************/
const initialVisibleColumns = {
  id: false,   
  task_id: true,
  task: true,
  technology: true,
  subcategory: true,
  category: true,
  topics: false,
  section: false,
  source: false,
  level: false,
  type: false,
  status: true,
  priority: true,
  progress: false,
  order: false,
  due_date: true,
  start_date: false,
  end_date: false,
  estimated_duration: false,
  actual_duration: false,
  done: false
}



export default function TasksPage() {
  // Set page title
  usePageTitle('Tasks Old')

  /*******************
    STATE VARIABLES
  ********************/
  // Fetching Data
  const [rows, setRows] = useState<TaskOld[]>([]);
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
  const [selectedRow, setSelectedRow] = useState<TaskOld | null>(null);  

  // Row Sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // Row Editing
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TaskOld | null>(null);

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
  const columns: ColumnDef<TaskOld>[] = [
    {
      accessorKey: "task_id",
      header: "Task ID",
      enableSorting: true,
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleRowClick(row.original)}
        >
          {row.original.task_id}
        </Button>
      ),
    },
    {
      accessorKey: "task",
      header: "Task",
      enableSorting: true,
    },
    {
      accessorKey: "technology",
      header: "Technology",
      enableSorting: true,
    },
    {
      accessorKey: "subcategory",
      header: "Subcategory",
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: true,
    },
    {
      accessorKey: "topics",
      header: "Topics",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.topics.map((topic, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">
              {topic}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "section",
      header: "Section",
      enableSorting: true,
    },
    {
      accessorKey: "source",
      header: "Source",
      enableSorting: true,
      cell: ({ row }) => (
        <span>{capitalizeWords(row.original.source)}</span>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      enableSorting: true,
      cell: ({ row }) => (
        <span>{capitalizeWords(row.original.level)}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      enableSorting: true,
      cell: ({ row }) => (
        <span>{capitalizeWords(row.original.type)}</span>
      ),
    },
    {
      accessorKey: "estimated_duration",
      header: "Est. Duration",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{row.original.estimated_duration}h</span>
        </div>
      ),
    },
    {
      accessorKey: "actual_duration",
      header: "Actual Duration",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{row.original.actual_duration}h</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId));
      }) as FilterFn<TaskOld>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getStatusColor(row.original.status as StatusEnum)} text-white`}>
          {capitalizeWords((row.original.status ?? '').replace('_', ' '))}
        </Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      enableSorting: true,
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId));
      }) as FilterFn<TaskOld>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getPriorityColor(row.original.priority as PriorityEnum)} text-white`}>
          {capitalizeWords(row.original.priority)}
        </Badge>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.progress} className="w-[60px]" />
          <span className="text-sm">{row.original.progress}%</span>
        </div>
      ),
    },
    {
      accessorKey: "order",
      header: "Order",
      enableSorting: true,
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      enableSorting: true,
      cell: ({ row }) => {
        const toLocalInputDate = (date: Date | string | null) => {
          if (!date) return '';
          const dateObj = date instanceof Date ? date : new Date(date);
          if (isNaN(dateObj.getTime())) return '';
          return dateObj.toISOString().split('T')[0];
        };
        return <span>{toLocalInputDate(row.original.due_date)}</span>;
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      enableSorting: true,
      cell: ({ row }) => {
        const toLocalInputDate = (date: Date | string | null) => {
          if (!date) return '';
          const dateObj = date instanceof Date ? date : new Date(date);
          if (isNaN(dateObj.getTime())) return '';
          return dateObj.toISOString().split('T')[0];
        };
        return <span>{toLocalInputDate(row.original.start_date)}</span>;
      },
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      enableSorting: true,
      cell: ({ row }) => {
        const toLocalInputDate = (date: Date | string | null) => {
          if (!date) return '';
          const dateObj = date instanceof Date ? date : new Date(date);
          if (isNaN(dateObj.getTime())) return '';
          return dateObj.toISOString().split('T')[0];
        };
        return <span>{toLocalInputDate(row.original.end_date)}</span>;
      },
    },
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
      const [statusesRes, prioritiesRes, categoriesRes] = await Promise.all([
        fetch('/api/tasksold/statuses'),
        fetch('/api/tasksold/priorities'),
        fetch('/api/tasksold/categories')
      ]);

      if (!statusesRes.ok || !prioritiesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch options');
      }

      const [statuses, priorities, categories] = await Promise.all([
        statusesRes.json(),
        prioritiesRes.json(),
        categoriesRes.json()
      ]);

      setStatusOptions(statuses);
      setPriorityOptions(priorities);
      setCategoryOptions(categories);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast({
        title: "Error",
        description: "Failed to load options.",
        variant: "destructive",
      });
    }
  };

  // Fetch Row Data
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasksold');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setRows(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
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
      const response = await fetch(`/api/tasksold/subcategories/${categoryId}`);
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
      const response = await fetch(`/api/tasksold/technologies/${subcategoryId}`);
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
  const startEditing = async (task: TaskOld) => {
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
        fetch('/api/tasksold/priorities'),
        fetch('/api/tasksold/statuses'),
        fetch('/api/tasksold/types'),
        fetch('/api/tasksold/levels'),
        fetch('/api/tasksold/sources'),
        fetch('/api/tasksold/categories')
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
  const onEditChange = (field: keyof TaskOld, value: TaskOld[keyof TaskOld]) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev)
  }

  // Update handleEditChange to fetch technologies when subcategory changes
  const handleEditChange = (field: keyof TaskOld, value: string | number | boolean | string[] | Date | null) => {
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
  const handleRowUpdate = async (updatedRow: TaskOld) => {
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
      const response = await fetch(`/api/tasksold/${updatedRow.id}`, {
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
      const response = await fetch(`/api/tasksold/${rowId}`, {
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
  const handleRowClick = useCallback((row: TaskOld) => {
    if (editingRow) return // Don't open sheet while editing
    setSelectedRow(row)
    setSheetOpen(true)
  }, [editingRow])


  
  /*******************
    RENDER CELLS IN EDIT-MODE
  ********************/
  const editModeRenderers: EditModeRenderer<TaskOld> = {
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

  
  
  /*******************
    ADD NEW TASKS
  ********************/
  const handleAddTask = async (newTask: TaskOldForm) => {
    console.log('Adding newTask to the table', newTask)
    try {
      // First, create the task
      const response = await fetch('/api/tasksold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })

      console.log('Response from the server', response)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add task')
      }

      // After successful creation, fetch the latest tasks to get the new one
      const fetchResponse = await fetch('/api/tasksold')
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch updated tasks')
      }
      
      const tasks = await fetchResponse.json()
      console.log('Fetched updated tasks', tasks)
      
      // Update the entire rows state with the latest data
      setRows(tasks)
      
      toast({
        title: "Success",
        description: "Task added successfully",
        duration: 3000,
      })
      
      return tasks[tasks.length - 1] // Return the newly added task
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
      throw error
    }
  }



  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CheckSquare className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Tasks Old</h1>
      </div>
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
          AddItemDialog={ShowAddTaskDialog}
          onAddItem={handleAddTask}
        />
      </div>

      <TaskOldSheet
        task={selectedRow}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}