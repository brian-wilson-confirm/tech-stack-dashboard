// "use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Task>[] = [
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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("task_id")}</div>,
  },
  {
    accessorKey: "task",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("task")}
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("technology")}
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("category")}
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("source")}
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
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate">
            {row.getValue("type")}
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
      const status = statuses.find((status) => status.value === row.getValue("status"))

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
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

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
      const progress = row.getValue("progress") as number
      return (
        <div className="flex items-center">
          <span>{progress}%</span>
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
      const duration = row.getValue("estimated_duration") as number
      return (
        <div className="flex items-center">
          <span>{duration} hrs</span>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]