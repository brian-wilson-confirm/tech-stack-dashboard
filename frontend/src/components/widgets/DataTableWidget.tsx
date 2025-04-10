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
  ColumnFiltersState,
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
import {
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
  X as CrossIcon,
  LayoutGrid
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  searchQuery: string
  setSearchQuery: (value: string) => void
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
  searchQuery,
  setSearchQuery,
  sortConfigs,
  onSortChange,
  editModeRenderers,
}: Props<T>) {
  // Add pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // Use column filters instead of global filter
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Update column filters when search query changes
  React.useEffect(() => {
    if (searchQuery) {
      setColumnFilters([
        {
          id: 'task',
          value: searchQuery,
        },
      ]);
    } else {
      setColumnFilters([]);
    }
  }, [searchQuery]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting: sortConfigs,
      columnVisibility: visibleColumns,
      pagination,
    },
    enableRowSelection: true,
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sortConfigs)
          : updaterOrValue
      onSortChange(newSorting)
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Get pagination info from table state
  const currentPageIndex = table.getState().pagination.pageIndex;
  const currentPageSize = table.getState().pagination.pageSize;
  const page = currentPageIndex + 1; // Convert 0-based to 1-based indexing for display
  const totalPages = table.getPageCount();
  
  // Get selected rows
  const selectedRowsArray = table.getSelectedRowModel().rows;
  const selectedRows = selectedRowsArray.length;
  
  // Get filtered rows
  const filteredRows = table.getFilteredRowModel().rows.length;

  // Handle row deletion
  const handleDeleteRow = (rowId: string) => {
    // Implement row deletion logic here if needed
    console.log(`Deleting row ${rowId}`);
  };

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
    <div className="border rounded-lg p-6 col-span-full">
      <div className="space-y-4">


        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative">
              <Input
                placeholder="Filter by task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
                disabled={!!editingRow}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                  onClick={() => setSearchQuery("")}
                  disabled={!!editingRow}
                >
                  <CrossIcon className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            {/*
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Status
                  {selectedStatus.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <span className="text-xs">{selectedStatus.length}</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.id}
                    checked={selectedStatus.includes(status.name)}
                    onCheckedChange={(checked) => {
                      startTransition(() => {
                        checked
                          ? setSelectedStatus([...selectedStatus, status.name])
                          : setSelectedStatus(selectedStatus.filter((value) => value !== status.name))
                      })
                    }}
                  >
                    {status.name.replace('_', ' ')}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Priority
                  {selectedPriority.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <span className="text-xs">{selectedPriority.length}</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {priorities.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority.id}
                    checked={selectedPriority.includes(priority.name)}
                    onCheckedChange={(checked) => {
                      startTransition(() => {
                        checked
                          ? setSelectedPriority([...selectedPriority, priority.name])
                          : setSelectedPriority(selectedPriority.filter((value) => value !== priority.name))
                      })
                    }}
                  >
                    {priority.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-dashed"
              onClick={resetFilters}
              disabled={(!searchQuery && selectedStatus.length === 0 && selectedPriority.length === 0) || !!editingTask}
            >
              Reset
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingTask}>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["task_id"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      task_id: value,
                    }))
                  }
                >
                  Task ID
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["task"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      task: value,
                    }))
                  }
                >
                  Task
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["technology"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      technology: value,
                    }))
                  }
                >
                  Technology
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["subcategory"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      subcategory: value,
                    }))
                  }
                >
                  Subcategory
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["category"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  Category
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["section"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      section: value,
                    }))
                  }
                >
                  Section
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["source"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      source: value,
                    }))
                  }
                >
                  Source
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["status"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                >
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["priority"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      priority: value,
                    }))
                  }
                >
                  Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["type"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  Type
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["level"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      level: value,
                    }))
                  }
                >
                  Level
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["progress"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      progress: value,
                    }))
                  }
                >
                  Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["order"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      order: value,
                    }))
                  }
                >
                  Order
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["estimated_duration"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      estimated_duration: value,
                    }))
                  }
                >
                  Est. Duration
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["actual_duration"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      actual_duration: value,
                    }))
                  }
                >
                  Actual Duration
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["start_date"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      start_date: value,
                    }))
                  }
                >
                  Start Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["end_date"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      end_date: value,
                    }))
                  }
                >
                  End Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility["done"]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      done: value,
                    }))
                  }
                >
                  Done
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>*/}
          </div>
          {/* <AddTaskDialog onAddTask={addRow} disabled={!!editingRow} /> */}
        </div>



        {/* Table */}
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
                            onClick={() => handleDeleteRow(row.original.id)}
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


        {/* Selected Rows */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border rounded-md bg-muted">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} {table.getFilteredSelectedRowModel().rows.length === 1 ? "row" : "rows"} selected
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                const selectedIds = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original.id)
                console.log("Delete rows with IDs:", selectedIds)
                // You could call a passed-in prop like onDeleteSelected(selectedIds)
              }}
            >
              Delete Selected
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const selectedData = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original)
                console.log("Export rows:", selectedData)
                // You could trigger CSV export or share to API
              }}
            >
              Export Selected
            </Button>
          </div>
        </div>
      )}





        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
          Displaying {filteredRows} of {" "}
            {data.length} {data.length === 1 ? "row" : "rows"} available
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value: string) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0, // reset to first page
                  }))
                }
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue>{pagination.pageSize}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span>←</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span>→</span>
              </Button>
            </div>
          </div>
        </div>



      </div>
    </div>
  )
}
