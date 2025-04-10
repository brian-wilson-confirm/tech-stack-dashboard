// TasksPage.tsx
import { useState, useEffect, useMemo, useTransition, useCallback } from "react"
import { z } from "zod"
import { ColumnDef, SortingState, VisibilityState, FilterFn } from "@tanstack/react-table"
import { DataTableWidget, EditModeRenderer } from "@/components/widgets/DataTableWidget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { capitalizeWords } from "@/lib/utils"
import { StatusType } from "@/types/enums"
import { PriorityType } from "@/types/enums"
import { Button } from "@/components/ui/button"
import { TaskSheet } from "@/components/ui/task-sheet"
import { Input } from "@/components/ui/input"


/*******************
  Schema Model
********************/
const TaskSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  task: z.string().min(1, "Task name is required"),
  technology: z.string(),
  subcategory: z.string(),
  category: z.string(),
  section: z.string(),
  source: z.string(),
  level: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  order: z.number(),
  estimated_duration: z.number().min(0),
  start_date: z.date(),
  end_date: z.date(),
  actual_duration: z.number().min(0),
})

type Task = z.infer<typeof TaskSchema>


/*******************
  Initial Row Data
********************/
const initialTasks: Task[] = [
  {
    id: "1",
    task_id: "TASK-8782",
    task: "Learn FastAPI",
    technology: "React",
    subcategory: "Runtime Environment",
    category: "Backend",
    //topics: [
    //  "Python",
    //  "FastAPI",
    //  "REST API"
    //],
    section: "Chapter 1",
    source: "PluralSight",
    level: "beginner",
    type: "learning",
    status: "completed",
    priority: "medium",
    //progress: 66,
    order: 1,
    start_date: new Date("2025-03-15"),
    end_date: new Date("2025-04-02"),
    estimated_duration: 40,
    actual_duration: 43,
    //done: false
  },
  { id: "4", task_id: "TASK-8783", task: "Regenerate all cycle participants", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 1", source: "PluralSight", level: "beginner", type: "learning", status: "not_started", priority: "medium", order: 2, estimated_duration: 10, start_date: new Date("2024-04-10"), end_date: new Date("2024-04-12"), actual_duration: 12 },
  { id: "5", task_id: "TASK-8784", task: "Modify Feedback", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 2", source: "PluralSight", level: "beginner", type: "learning", status: "in_progress", priority: "medium", order: 3, estimated_duration: 20, start_date: new Date("2024-04-12"), end_date: new Date("2024-04-15"), actual_duration: 23 },
  { id: "6", task_id: "TASK-8785", task: "Delete Recognition", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 3", source: "PluralSight", level: "beginner", type: "learning", status: "completed", priority: "high", order: 4, estimated_duration: 15, start_date: new Date("2024-04-15"), end_date: new Date("2024-04-15"), actual_duration: 15 },
  { id: "7", task_id: "TASK-8786", task: "Disable Campaign reports", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 4", source: "PluralSight", level: "beginner", type: "learning", status: "on_hold", priority: "medium", order: 5, estimated_duration: 8, start_date: new Date("2024-04-09"), end_date: new Date("2024-04-10"), actual_duration: 10 },
  { id: "8", task_id: "TASK-8787", task: "Audit Jest Tests", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 5", source: "PluralSight", level: "beginner", type: "learning", status: "in_progress", priority: "medium", order: 6, estimated_duration: 12, start_date: new Date("2024-04-13"), end_date: new Date("2024-04-15"), actual_duration: 14 },
  { id: "9", task_id: "TASK-8788", task: "Fix Inconsistent Data", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 6", source: "PluralSight", level: "beginner", type: "learning", status: "completed", priority: "medium", order: 7, estimated_duration: 18, start_date: new Date("2024-04-14"), end_date: new Date("2024-04-14"), actual_duration: 18 },
  { id: "10", task_id: "TASK-8789", task: "Update Support Article", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 7", source: "PluralSight", level: "beginner", type: "learning", status: "not_started", priority: "low", order: 8, estimated_duration: 14, start_date: new Date("2024-04-11"), end_date: new Date("2024-04-12"), actual_duration: 14 },
  { id: "11", task_id: "TASK-8790", task: "Defect: Error Sending Email", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 8", source: "PluralSight", level: "beginner", type: "learning", status: "on_hold", priority: "medium", order: 9, estimated_duration: 16, start_date: new Date("2024-04-16"), end_date: new Date("2024-04-17"), actual_duration: 17 },
  { id: "12", task_id: "TASK-8791", task: "Pentest Changes", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 9", source: "PluralSight", level: "beginner", type: "learning", status: "not_started", priority: "medium", order: 10, estimated_duration: 11, start_date: new Date("2024-04-08"), end_date: new Date("2024-04-10"), actual_duration: 11 },
  { id: "13", task_id: "TASK-8792", task: "Update Priority Endpoints", technology: "React", subcategory: "Runtime Environment", category: "Backend", section: "Chapter 10", source: "PluralSight", level: "beginner", type: "learning", status: "in_progress", priority: "medium", order: 11, estimated_duration: 9, start_date: new Date("2024-04-17"), end_date: new Date("2024-04-18"), actual_duration: 10 },
]


/*******************
  Options Data
********************/
const technologyOptions = [{"name":"FastAPI","id":42},{"name":"Django","id":43}]
const subcategoryOptions = [{"id":33,"name":"Runtime Environment","category_id":10},{"id":34,"name":"Build & Compile Tool","category_id":10},{"id":35,"name":"UI Framework","category_id":10},{"id":36,"name":"JS Library","category_id":10},{"id":37,"name":"Testing & Debugging","category_id":10},{"id":64,"name":"Language","category_id":10}]
const categoryOptions = [{"id":10,"name":"Frontend"},{"id":11,"name":"Middleware"},{"id":12,"name":"Backend"},{"id":13,"name":"Database"},{"id":14,"name":"Messaging"},{"id":15,"name":"DevOps"},{"id":16,"name":"Security"},{"id":17,"name":"Monitoring"}]
const sourceOptions = [{"id":16,"name":"Internal Project"},{"id":17,"name":"Architecture Review"},{"id":18,"name":"Security Audit"},{"id":19,"name":"Performance Optimization"},{"id":20,"name":"Bug Report"},{"id":21,"name":"Feature Request"},{"id":22,"name":"Technical Debt"},{"id":23,"name":"Learning Path"},{"id":24,"name":"Research Initiative"},{"id":25,"name":"Compliance Requirement"},{"id":26,"name":"Customer Feedback"},{"id":27,"name":"Team Initiative"},{"id":28,"name":"Infrastructure Upgrade"},{"id":29,"name":"Documentation Sprint"},{"id":30,"name":"PluralSight"}]
const levelOptions = [{"id":1,"name":"beginner"},{"id":2,"name":"intermediate"},{"id":3,"name":"advanced"},{"id":4,"name":"expert"}]
const typeOptions = [{"id":1,"name":"learning"},{"id":2,"name":"implementation"},{"id":3,"name":"research"},{"id":4,"name":"documentation"},{"id":5,"name":"maintenance"}]
const statusOptions = [{"name":"not_started","id":1},{"name":"in_progress","id":2},{"name":"completed","id":3},{"name":"on_hold","id":4},{"name":"canceled","id":5}]
const priorityOptions = [{"name":"low","id":1},{"name":"medium","id":2},{"name":"high","id":3},{"name":"critical","id":4}]


/*******************
  Option Formatting
********************/
const getStatusColor = (status: string) => {
  const colors: Record<StatusType, string> = {
    'not_started': "bg-gray-500",
    'in_progress': "bg-blue-500",
    'completed': "bg-green-500",
    'on_hold': "bg-yellow-500",
    'canceled': "bg-red-500"
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


/*******************
  Visible Columns
********************/
  const initialVisibleColumns = {
    id: false,                   // ✓ ID  
    task_id: true,              // ✓ Task ID
    task: true,                 // ✓ Task
    technology: true,           // ✓ Technology
    subcategory: false,         // Subcategory
    category: true,             // ✓ Category
    //topics: false,              // Topics
    section: false,             // Section
    source: true,               // ✓ Source
    level: false,               // Level
    type: true,                 // ✓ Type
    status: true,               // ✓ Status
    priority: true,             // ✓ Priority
    //progress: false,            // Progress
    order: false,               // Order
    //due_date: false,            // Due Date
    start_date: true,          // Start Date
    end_date: false,            // End Date
    estimated_duration: true,   // ✓ Est. Duration
    actual_duration: false,     // Actual Duration
    //done: false                 // Done
  }
  


export default function TasksPage() {
  /*******************
    State Variables
  ********************/
  const [rows, setRows] = useState<Task[]>(initialTasks)
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortConfigs, setSortConfigs] = useState<SortingState>([])
  const [selectedRow, setSelectedRow] = useState<Task | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<VisibilityState>(initialVisibleColumns)
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)



  /*******************
    Data to Columns: Mapping, Ordering, Read-Only Format...
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
        <Badge variant="secondary" className={`${getStatusColor(row.original.status)} text-white`}>
          {capitalizeWords(row.original.status.replace('_', ' '))}
        </Badge>
      )
    },
    { accessorKey: "priority", header: "Priority", 
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }) as FilterFn<Task>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getPriorityColor(row.original.priority)} text-white`}>
          {capitalizeWords(row.original.priority)}
        </Badge>
      )
    },
    { accessorKey: "order", header: "Order" },
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date) => {
        const tzOffsetMs = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0]
      }
      return <span>{toLocalInputDate(row.original.start_date)}</span>
    }},
    { accessorKey: "end_date", header: "End Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date) => {
        const tzOffsetMs = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0]
      }
      return <span>{toLocalInputDate(row.original.end_date)}</span>
    }}, 
    
  ]



  /*******************
    Custom Filter Configs
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



  /*******************
    Column Toggle
  ********************/
  const columnOptions = columns.map(column => ({
    accessorKey: (column as any).accessorKey,
    header: typeof column.header === 'string' ? column.header : 'Column'
  }))




  /*******************
    Functions()
  ********************/
  const startEditing = (row: Task) => {
    setEditingRow(row.id)
    setEditForm({ ...row })
  }

  const onEditChange = (field: keyof Task, value: Task[keyof Task]) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const onSaveEdit = () => {
    if (editForm) {
      setRows(prev => prev.map(t => t.id === editForm.id ? editForm : t))
      setEditingRow(null)
      setEditForm(null)
    }
  }

  const onCancelEdit = () => {
    setEditingRow(null)
    setEditForm(null)
  }

  const handleRowClick = useCallback((row: Task) => {
    if (editingRow) return // Don't open sheet while editing
    setSelectedRow(row)
    setSheetOpen(true)
  }, [editingRow])

  


  /*******************
    Edit Mode Renderers
  ********************/
  const editModeRenderers: EditModeRenderer<Task> = {
    technology: (value, onChange) => (
      <Select
        value={technologyOptions.find((t) => t.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedTechnology = technologyOptions.find((t) => t.id.toString() === selectedId);
          if (selectedTechnology) {
            onChange(selectedTechnology.name);
          }
        }}
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
    subcategory: (value, onChange) => (
      <Select
        value={subcategoryOptions.find((s) => s.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedSubcategory = subcategoryOptions.find((s) => s.id.toString() === selectedId);
          if (selectedSubcategory) {
            onChange(selectedSubcategory.name);
          }
        }}
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
    category: (value, onChange) => (
      <Select
        value={categoryOptions.find((c) => c.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedCategory = categoryOptions.find((c) => c.id.toString() === selectedId);
          if (selectedCategory) {
            onChange(selectedCategory.name);
          }
        }}
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
        value={sourceOptions.find((s) => s.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedSource = sourceOptions.find((s) => s.id.toString() === selectedId);
          if (selectedSource) {
            onChange(selectedSource.name);
          }
        }}
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
        value={levelOptions.find((l) => l.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedLevel = levelOptions.find((l) => l.id.toString() === selectedId);
          if (selectedLevel) {
            onChange(selectedLevel.name);
          }
        }}
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
        value={typeOptions.find((t) => t.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedType = typeOptions.find((t) => t.id.toString() === selectedId);
          if (selectedType) {
            onChange(selectedType.name);
          }
        }}
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
        value={statusOptions.find((s) => s.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedStatus = statusOptions.find((s) => s.id.toString() === selectedId);
          if (selectedStatus) {
            onChange(selectedStatus.name);
          }
        }}
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
        value={priorityOptions.find((p) => p.name === value)?.id.toString() ?? ""}
        onValueChange={(selectedId) => {
          const selectedPriority = priorityOptions.find((p) => p.id.toString() === selectedId);
          if (selectedPriority) {
            onChange(selectedPriority.name);
          }
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map(priority => (
            <SelectItem key={priority.id} value={priority.id.toString()}>{capitalizeWords(priority.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    start_date: (value, onChange) => {
      const toLocalInputDate = (date: Date) => {
        const tzOffsetMs = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0]
      }
    
      const fromLocalInputDate = (dateStr: string) => {
        const localDate = new Date(dateStr)
        const tzOffsetMs = localDate.getTimezoneOffset() * 60000
        return new Date(localDate.getTime() + tzOffsetMs)
      }
    
      return (
        <Input
          type="date"
          value={value ? toLocalInputDate(new Date(value)) : ''}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      )
    },
    end_date: (value, onChange) => {
      const toLocalInputDate = (date: Date) => {
        const tzOffsetMs = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0]
      }
    
      const fromLocalInputDate = (dateStr: string) => {
        const localDate = new Date(dateStr)
        const tzOffsetMs = localDate.getTimezoneOffset() * 60000
        return new Date(localDate.getTime() + tzOffsetMs)
      }

      return (
        <Input
          type="date"
          value={value ? toLocalInputDate(new Date(value)) : ''}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      )
    }
  }


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
      <br />
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">New Widget</h2>
        <NewWidget tasks={tasks} />
      </div>
      <br />*/}
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">DataTable Widget</h2>
        <DataTableWidget
          data={rows}
          columns={columns}
          columnOptions={columnOptions}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={setVisibleColumns}
          editingRow={editingRow}
          editForm={editForm}
          editModeRenderers={editModeRenderers}
          onEditChange={onEditChange}
          onStartEdit={startEditing}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterConfigs={filterConfigs}
          sortConfigs={sortConfigs}
          onSortChange={setSortConfigs}
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