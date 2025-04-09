// DataTableWidget.tsx
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export type EditModeRenderer<T> = Partial<
  Record<keyof T, (value: T[keyof T], onChange: (val: T[keyof T]) => void) => React.ReactNode>
>

type Props<T extends Record<string, any>> = {
  data: T[]
  columns: ColumnDef<T>[]
  editingRow: string | null
  editForm: T | null
  onEditChange: (field: keyof T, value: T[keyof T]) => void
  onStartEdit: (row: T) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  sortConfigs: SortingState
  onSortChange: (sort: SortingState) => void
  editModeRenderers?: EditModeRenderer<T>
}

export function DataTableWidget<T extends Record<string, any>>({
  data,
  columns,
  editingRow,
  editForm,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  globalFilter,
  onGlobalFilterChange,
  sortConfigs,
  onSortChange,
  editModeRenderers,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting: sortConfigs,
    },
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sortConfigs)
          : updaterOrValue
    
      onSortChange(newSorting)
    },
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const renderEditableCell = (cell: any, rowId: string) => {
    const field = cell.column.id as keyof T
    const value = editForm?.[field]
    const renderer = editModeRenderers?.[field]

    const fallback: T[keyof T] =
      typeof value === "number" ? 0 as T[keyof T] :
      typeof value === "boolean" ? false as T[keyof T] :
      "" as T[keyof T]

    if (renderer) {
      return renderer(value ?? fallback, (newValue) => onEditChange(field, newValue))
    }

    if (typeof value === "number") {
      return (
        <Input
          type="number"
          value={value ?? fallback}
          onChange={(e) => onEditChange(field, Number(e.target.value) as T[keyof T])}
        />
      )
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return (
        <Input
          type="date"
          value={value ?? fallback}
          onChange={(e) => onEditChange(field, e.target.value as T[keyof T])}
        />
      )
    }

    return (
      <Input
        value={value as string || ""}
        onChange={(e) => onEditChange(field, e.target.value as T[keyof T])}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="w-[200px]"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {editingRow === row.original.id ? (
                      renderEditableCell(cell, row.original.id)
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editingRow === row.original.id ? (
                    <>
                      <Button onClick={onSaveEdit} size="sm">Save</Button>
                      <Button onClick={onCancelEdit} size="sm" variant="ghost">Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => onStartEdit(row.original)} size="sm">Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
