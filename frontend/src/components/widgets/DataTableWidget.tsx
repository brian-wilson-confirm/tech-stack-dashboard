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
  VisibilityState,
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
import { Check, Trash2, X } from "lucide-react"
import { Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type EditModeRenderer<T> = Partial<
  Record<keyof T, (value: T[keyof T], onChange: (val: T[keyof T]) => void) => React.ReactNode>
>

type Props<T extends Record<string, any>> = {
  data: T[]
  columns: ColumnDef<T>[]
  visibleColumns: VisibilityState
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
  visibleColumns,
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
      columnVisibility: visibleColumns,
    },
    enableRowSelection: true,
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


          {/* Table Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* Select All checkbox */}
                <TableHead className="w-12">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                    aria-label="Select all rows"
                  />
                </TableHead>

                {headerGroup.headers.map((header) =>
                  header.column.id in visibleColumns && visibleColumns[header.column.id] ? (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ) : null
                )}

                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>


          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>

                {/* Row checkbox */}
                <TableCell className="w-12">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                    aria-label={`Select row ${row.id}`}
                  />
                </TableCell>

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
                      <Button variant="ghost" size="icon" onClick={onSaveEdit}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={onCancelEdit}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <>
                        <Button variant="ghost" size="icon" onClick={() => onStartEdit(row.original)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteRow(rowData.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      {/* Pagination */}
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
