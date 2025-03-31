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
  MoreHorizontal,
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Task {
  id: string
  done: boolean
  task: string
  technology: string
  subcategory: string
  category: string
}

interface TasksWidgetProps {
  tasks: Task[]
}

export function TasksWidget({ tasks: initialTasks }: TasksWidgetProps) {
  //console.log('Initial tasks in widget:', initialTasks)
  const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Task | null>(null)

  // Initialize tasks only once
  useEffect(() => {
    if (!tasks.length && initialTasks?.length) {
      setTasks(initialTasks)
    }
  }, [initialTasks])

  const totalPages = Math.ceil(tasks.length / rowsPerPage)
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const currentTasks = tasks.slice(start, end)

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

  const handleEditChange = (field: keyof Task, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value })
    }
  }

  return (
    <div className="border rounded-lg p-6 col-span-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Today's Tasks</h2>
        <Button variant="outline" size="sm">
          Add Task
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">Done</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Technology</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Category</TableHead>
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
                      value={editForm?.technology}
                      onChange={(e) => handleEditChange('technology', e.target.value)}
                      className="w-full"
                    />
                  ) : task.technology}
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
                      value={editForm?.category}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                      className="w-full"
                    />
                  ) : task.category}
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