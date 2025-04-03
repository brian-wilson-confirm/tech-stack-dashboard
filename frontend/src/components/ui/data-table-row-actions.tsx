import { Row } from "@tanstack/react-table"
import { Check, Pen, Trash, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Task } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit: (task: Task) => void
  onSave: (task: Task) => void
  onCancel: () => void
  onDelete?: (task: Task) => void
  isEditing: boolean
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isEditing,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSave(task)}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(task)}
        className="h-8 w-8 p-0"
      >
        <Pen className="h-4 w-4" />
      </Button>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 