// TasksPage.tsx
import * as React from "react"
import { z } from "zod"
import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTableWidget, EditModeRenderer } from "@/components/widgets/DataTableWidget"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare } from "lucide-react"


/*******************
  Schema Model
********************/
const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  score: z.number(),
  dueDate: z.string(),
})

type Task = z.infer<typeof TaskSchema>


/*******************
  Initial Row Data
********************/
const initialTasks: Task[] = [
  { id: "1", name: "Task A", status: "Open", score: 10, dueDate: "2024-04-10" },
  { id: "2", name: "Task B", status: "In Progress", score: 20, dueDate: "2024-04-12" },
  { id: "3", name: "Task C", status: "Done", score: 15, dueDate: "2024-04-15" },
  { id: "4", name: "Task D", status: "Open", score: 8, dueDate: "2024-04-09" },
  { id: "5", name: "Task E", status: "In Progress", score: 12, dueDate: "2024-04-13" },
  { id: "6", name: "Task F", status: "Done", score: 18, dueDate: "2024-04-14" },
  { id: "7", name: "Task G", status: "Open", score: 14, dueDate: "2024-04-11" },
  { id: "8", name: "Task H", status: "Done", score: 16, dueDate: "2024-04-16" },
  { id: "9", name: "Task I", status: "Open", score: 11, dueDate: "2024-04-08" },
  { id: "10", name: "Task J", status: "In Progress", score: 9, dueDate: "2024-04-17" },
]


/*******************
  Options Data
********************/
const statusOptions = ["Open", "In Progress", "Done"]



export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [editingRow, setEditingRow] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Task | null>(null)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sortConfigs, setSortConfigs] = React.useState<SortingState>([])

  const columns: ColumnDef<Task>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "score", header: "Score" },
    { accessorKey: "dueDate", header: "Due Date" },
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
      <Select value={value?.toString() ?? ""} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(status => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
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