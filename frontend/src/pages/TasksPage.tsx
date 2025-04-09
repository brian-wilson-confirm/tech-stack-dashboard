// TasksPage.tsx
import * as React from "react"
import { z } from "zod"
import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTableWidget, EditModeRenderer } from "@/components/widgets/DataTableWidget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare } from "lucide-react"
import { capitalizeWords } from "@/lib/utils"


/*******************
  Schema Model
********************/
const TaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  status: z.string(),
  priority: z.string(),
  estimated_duration: z.number(),
  start_date: z.string(),
})

type Task = z.infer<typeof TaskSchema>


/*******************
  Initial Row Data
********************/
const initialTasks: Task[] = [
  {
    id: "1",
    //task_id: "TASK-8782",
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
    //source: "PluralSight",
    //level: "beginner",
    //type: "learning",
    status: "completed",
    priority: "medium",
    //progress: 66,
    //order: 1,
    start_date: "2025-03-15",
    //end_date: "2025-04-02",
    estimated_duration: 40,
    //actual_duration: 43,
    //done: false
  },
  { id: "4", task: "Regenerate all cycle participants", status: "not_started", priority: "medium", estimated_duration: 10, start_date: "2024-04-10" },
  { id: "5", task: "Modify Feedback", status: "in_progress", priority: "medium", estimated_duration: 20, start_date: "2024-04-12" },
  { id: "6", task: "Delete Recognition", status: "completed", priority: "high", estimated_duration: 15, start_date: "2024-04-15" },
  { id: "7", task: "Disable Campaign reports", status: "on_hold", priority: "medium", estimated_duration: 8, start_date: "2024-04-09" },
  { id: "8", task: "Audit Jest Tests", status: "in_progress", priority: "medium", estimated_duration: 12, start_date: "2024-04-13" },
  { id: "9", task: "Fix Inconsistent Data", status: "completed", priority: "medium", estimated_duration: 18, start_date: "2024-04-14" },
  { id: "10", task: "Update Support Article", status: "not_started", priority: "low", estimated_duration: 14, start_date: "2024-04-11" },
  { id: "11", task: "Defect: Error Sending Email", status: "on_hold", priority: "medium", estimated_duration: 16, start_date: "2024-04-16" },
  { id: "12", task: "Pentest Changes", status: "not_started", priority: "medium", estimated_duration: 11, start_date: "2024-04-08" },
  { id: "13", task: "Update Priority Endpoints", status: "in_progress", priority: "medium", estimated_duration: 9, start_date: "2024-04-17" },
]


/*******************
  Options Data
********************/
const statusOptions = [{"name":"not_started","id":1},{"name":"in_progress","id":2},{"name":"completed","id":3},{"name":"on_hold","id":4},{"name":"canceled","id":5}]
const priorityOptions = [{"name":"low","id":1},{"name":"medium","id":2},{"name":"high","id":3},{"name":"critical","id":4}]


export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [editingRow, setEditingRow] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Task | null>(null)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sortConfigs, setSortConfigs] = React.useState<SortingState>([])


  /*******************
    Data to Columns
  ********************/
  const columns: ColumnDef<Task>[] = [
    { accessorKey: "task", header: "Task" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => capitalizeWords(row.original.status.replace('_', ' ')) },
    { accessorKey: "priority", header: "Priority", cell: ({ row }) => capitalizeWords(row.original.priority) },
    { accessorKey: "estimated_duration", header: "Estimated Duration" },
    { accessorKey: "start_date", header: "Start Date" },
  ]

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

  
  /*******************
    Edit Mode Renderers
  ********************/
  const editModeRenderers: EditModeRenderer<Task> = {
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
    </div>
  )
}