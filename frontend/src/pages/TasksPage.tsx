// TasksPage.tsx
import { useState, useEffect, useMemo, useTransition, useCallback } from "react"
import { z } from "zod"
import { ColumnDef, SortingState } from "@tanstack/react-table"
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
  source: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  estimated_duration: z.number().min(0),
  start_date: z.date(),
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
    //technology: "React",
    //subcategory: "Runtime Environment",
    //category: "Backend",
    //topics: [
    //  "Python",
    //  "FastAPI",
    //  "REST API"
    //],
    //section: "Learning",
    source: "PluralSight",
    //level: "beginner",
    type: "learning",
    status: "completed",
    priority: "medium",
    //progress: 66,
    //order: 1,
    start_date: new Date("2025-03-15"),
    //end_date: "2025-04-02",
    estimated_duration: 40,
    //actual_duration: 43,
    //done: false
  },
  { id: "4", task_id: "TASK-8783", task: "Regenerate all cycle participants", source: "PluralSight", type: "learning", status: "not_started", priority: "medium", estimated_duration: 10, start_date: new Date("2024-04-10") },
  { id: "5", task_id: "TASK-8784", task: "Modify Feedback", source: "PluralSight", type: "learning", status: "in_progress", priority: "medium", estimated_duration: 20, start_date: new Date("2024-04-12") },
  { id: "6", task_id: "TASK-8785", task: "Delete Recognition", source: "PluralSight", type: "learning", status: "completed", priority: "high", estimated_duration: 15, start_date: new Date("2024-04-15") },
  { id: "7", task_id: "TASK-8786", task: "Disable Campaign reports", source: "PluralSight", type: "learning", status: "on_hold", priority: "medium", estimated_duration: 8, start_date: new Date("2024-04-09") },
  { id: "8", task_id: "TASK-8787", task: "Audit Jest Tests", source: "PluralSight", type: "learning", status: "in_progress", priority: "medium", estimated_duration: 12, start_date: new Date("2024-04-13") },
  { id: "9", task_id: "TASK-8788", task: "Fix Inconsistent Data", source: "PluralSight", type: "learning", status: "completed", priority: "medium", estimated_duration: 18, start_date: new Date("2024-04-14") },
  { id: "10", task_id: "TASK-8789", task: "Update Support Article", source: "PluralSight", type: "learning", status: "not_started", priority: "low", estimated_duration: 14, start_date: new Date("2024-04-11") },
  { id: "11", task_id: "TASK-8790", task: "Defect: Error Sending Email", source: "PluralSight", type: "learning", status: "on_hold", priority: "medium", estimated_duration: 16, start_date: new Date("2024-04-16") },
  { id: "12", task_id: "TASK-8791", task: "Pentest Changes", source: "PluralSight", type: "learning", status: "not_started", priority: "medium", estimated_duration: 11, start_date: new Date("2024-04-08") },
  { id: "13", task_id: "TASK-8792", task: "Update Priority Endpoints", source: "PluralSight", type: "learning", status: "in_progress", priority: "medium", estimated_duration: 9, start_date: new Date("2024-04-17") },
]


/*******************
  Options Data
********************/
const sourceOptions = [{"id":16,"name":"Internal Project"},{"id":17,"name":"Architecture Review"},{"id":18,"name":"Security Audit"},{"id":19,"name":"Performance Optimization"},{"id":20,"name":"Bug Report"},{"id":21,"name":"Feature Request"},{"id":22,"name":"Technical Debt"},{"id":23,"name":"Learning Path"},{"id":24,"name":"Research Initiative"},{"id":25,"name":"Compliance Requirement"},{"id":26,"name":"Customer Feedback"},{"id":27,"name":"Team Initiative"},{"id":28,"name":"Infrastructure Upgrade"},{"id":29,"name":"Documentation Sprint"},{"id":30,"name":"PluralSight"}]
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



export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Task | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [sortConfigs, setSortConfigs] = useState<SortingState>([])
  const [selectedRow, setSelectedRow] = useState<Task | null>(null)
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
    { accessorKey: "source", header: "Source", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.source)}</span>
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
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <Badge variant="secondary" className={`${getStatusColor(row.original.status)} text-white`}>
        {capitalizeWords(row.original.status.replace('_', ' '))}
      </Badge>
    )},
    { accessorKey: "priority", header: "Priority", cell: ({ row }) => (
      <Badge variant="secondary" className={`${getPriorityColor(row.original.priority)} text-white`}>
        {capitalizeWords(row.original.priority)}
      </Badge>
    )},
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date) => {
        const tzOffsetMs = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0]
      }
      return <span>{toLocalInputDate(row.original.start_date)}</span>
  }},
  ]



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
      setTasks(prev => prev.map(t => t.id === editForm.id ? editForm : t))
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
          data={tasks}
          columns={columns}
          editingRow={editingRow}
          editForm={editForm}
          onEditChange={onEditChange}
          onStartEdit={startEditing}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          sortConfigs={sortConfigs}
          onSortChange={setSortConfigs}
          editModeRenderers={editModeRenderers}
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