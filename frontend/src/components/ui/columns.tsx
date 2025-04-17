// "use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

//import { priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Button } from "./button"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface ColumnOptions {
  onTaskClick: (task: Task) => void
  editingRow: string | null
  onEditChange: (field: string, value: any) => void
  onEdit: (task: Task) => void
  onSave: (task: Task) => void
  onCancel: () => void
  onDelete: (task: Task) => void
  editedTask: Task | null
}

export const createColumns = ({
  onTaskClick,
  editingRow,
  onEditChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  editedTask,
}: ColumnOptions): ColumnDef<Task>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "task_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => {
      const task = row.original
      return (
        <Button
          variant="link"
          className="p-0 h-auto font-medium"
          onClick={() => onTaskClick(task)}
        >
          {task.task_id}
        </Button>
      )
    },
  },
  {
    accessorKey: "task",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.task : row.getValue("task") as string

      if (isEditing) {
        return (
          <Input
            value={value}
            onChange={(e) => onEditChange("task", e.target.value)}
            className="h-8 w-full"
          />
        )
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "technology",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Technology" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.technology : row.getValue("technology") as string

      if (isEditing) {
        return (
          <Input
            value={value}
            onChange={(e) => onEditChange("technology", e.target.value)}
            className="h-8 w-full"
          />
        )
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "subcategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategory" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">
            {row.getValue("subcategory")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.category : row.getValue("category") as string

      if (isEditing) {
        return (
          <Input
            value={value}
            onChange={(e) => onEditChange("category", e.target.value)}
            className="h-8 w-full"
          />
        )
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">
            {row.getValue("section")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.source : row.getValue("source") as string

      if (isEditing) {
        return (
          <Input
            value={value}
            onChange={(e) => onEditChange("source", e.target.value)}
            className="h-8 w-full"
          />
        )
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">
            {row.getValue("level")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.type : row.getValue("type") as string

      if (isEditing) {
        return (
          <Input
            value={value}
            onChange={(e) => onEditChange("type", e.target.value)}
            className="h-8 w-full"
          />
        )
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.status : row.getValue("status") as string
      const status = statuses.find((status) => status.value === value)

      if (isEditing) {
        return (
          <Select
            value={value}
            onValueChange={(value) => onEditChange("status", value)}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue>{status?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          <Badge variant="outline">{status.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.priority : row.getValue("priority") as string
      const priority = priorities.find(
        (priority) => priority.value === value
      )

      if (isEditing) {
        return (
          <Select
            value={value}
            onValueChange={(value) => onEditChange("priority", value)}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue>{priority?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          <Badge variant="outline">{priority.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.progress : row.getValue("progress") as number

      if (isEditing) {
        return (
          <Input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onEditChange("progress", parseInt(e.target.value))}
            className="h-8 w-[100px]"
          />
        )
      }

      return (
        <div className="flex items-center">
          <span>{value}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => {
      const order = row.getValue("order") as number
      return (
        <div className="flex items-center">
          <span>{order}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "estimated_duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Est. Duration" />
    ),
    cell: ({ row }) => {
      const isEditing = editingRow === row.original.task_id
      const value = isEditing && editedTask ? editedTask.estimated_duration : row.getValue("estimated_duration") as number

      if (isEditing) {
        return (
          <Input
            type="number"
            min={0}
            value={value}
            onChange={(e) => onEditChange("estimated_duration", parseInt(e.target.value))}
            className="h-8 w-[100px]"
          />
        )
      }

      return (
        <div className="flex items-center">
          <span>{value} hrs</span>
        </div>
      )
    },
  },
  {
    accessorKey: "done",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Done" />
    ),
    cell: ({ row }) => {
      const done = row.getValue("done") as boolean
      return (
        <div className="flex items-center">
          <Checkbox checked={done} disabled />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        isEditing={editingRow === row.original.task_id}
      />
    ),
  },
]