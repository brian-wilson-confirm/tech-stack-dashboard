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
  OnChangeFn,
  PaginationState,
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
  X as CrossIcon,
  LayoutGrid,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { capitalizeWords, cn } from "@/lib/utils"

export type EditModeRenderer<T> = Partial<
  Record<keyof T, (value: T[keyof T], onChange: (val: T[keyof T]) => void) => React.ReactNode>
>

export type FilterOption = {
  id: string | number
  name: string
}

export type FilterConfig = {
  field: string
  label: string
  options: FilterOption[]
  selected: string[]
  onSelect: (values: string[]) => void
}

export type ColumnOption = {
  accessorKey: string
  header: string
}

type Props<T extends Record<string, any>> = {
  title?: string
  data: T[]
  isLoading?: boolean
  columns: ColumnDef<T>[]
  columnOptions?: ColumnOption[]
  visibleColumns: VisibilityState
  columnFilters?: ColumnFiltersState;
  onColumnVisibilityChange: (value: VisibilityState) => void
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: OnChangeFn<PaginationState>;
  filterConfigs?: FilterConfig[]
  searchQuery?: string
  setSearchQuery?: (value: string) => void
  sortConfigs?: SortingState
  onSortChange?: (sort: SortingState) => void
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: OnChangeFn<Record<string, boolean>>
  editForm: T | null
  editModeRenderers?: EditModeRenderer<T>
  nonEditableColumns?: string[]
  onStartEdit?: (row: T) => void
  onEditChange?: (field: keyof T, value: T[keyof T]) => void
  editingRow: string | null
  onSaveEdit?: () => void
  onCancelEdit?: () => void
  onDeleteRow?: (rowId: string) => Promise<void>
  showCheckboxes?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  tableClassName?: string;
  AddItemDialog?: React.ComponentType<{ onAddItem: (item: any) => Promise<any>, disabled?: boolean }>;
  onAddItem?: (item: any) => Promise<any>;
}

const FilterDropdown = ({ config, editingRow }: { config: FilterConfig, editingRow: string | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingRow}>
          <Filter className="mr-2 h-4 w-4" />
          {config.label}
          {config.selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="text-xs">{config.selected.length}</span>
            </>
                )}
              </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Filter by {config.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {config.options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={config.selected.includes(option.name)}
            onCheckedChange={(checked) => {
              const newSelected = checked
                ? [...config.selected, option.name]
                : config.selected.filter((value) => value !== option.name)
              config.onSelect(newSelected)
            }}
          >
            {capitalizeWords(option.name.replace(/_/g, ' '))}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ColumnVisibilityDropdown = ({ 
  columnOptions, 
  visibleColumns, 
  onColumnVisibilityChange,
  editingRow 
}: { 
  columnOptions?: ColumnOption[]
  visibleColumns: VisibilityState
  onColumnVisibilityChange: (value: VisibilityState) => void
  editingRow: string | null
}) => {
  if (!columnOptions) return null

    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingRow}>
          <LayoutGrid className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnOptions.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.accessorKey}
            checked={visibleColumns[column.accessorKey]}
            onCheckedChange={(value) => {
              if (visibleColumns[column.accessorKey] === value) return; // 🚫 prevent loop
              onColumnVisibilityChange({
                ...visibleColumns,
                [column.accessorKey]: value
              });
            }}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableWidget<T extends Record<string, any>>({
  title,
  data,
  isLoading,
  columns,
  columnOptions,
  visibleColumns,
  columnFilters,
  onColumnVisibilityChange,
  onColumnFiltersChange,
  pagination,
  onPaginationChange,
  filterConfigs,
  searchQuery,
  setSearchQuery,
  sortConfigs,
  onSortChange,
  rowSelection,
  onRowSelectionChange,
  editForm,
  editModeRenderers,
  nonEditableColumns,
  onStartEdit,
  onEditChange,
  editingRow,
  onSaveEdit,
  onCancelEdit,
  onDeleteRow,
  showCheckboxes,
  showActions,
  showPagination = true,
  tableClassName,
  AddItemDialog,
  onAddItem,
}: Props<T>) {

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection: rowSelection,
      columnFilters: columnFilters ?? [],
      sorting: sortConfigs ?? [],
      columnVisibility: visibleColumns,
      pagination: showPagination ? pagination : undefined,
    },
    onRowSelectionChange: onRowSelectionChange ?? (() => {}),
    enableColumnResizing: true,
    enableRowSelection: true,
    onSortingChange: (updaterOrValue) => {
      const newSorting = typeof updaterOrValue === "function" 
        ? updaterOrValue(sortConfigs ?? [])
        : updaterOrValue;
      onSortChange?.(newSorting);
    },
    onPaginationChange: showPagination ? onPaginationChange : undefined,
    onColumnFiltersChange,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
    autoResetPageIndex: false,
    pageCount: showPagination && pagination ? Math.ceil(data.length / pagination.pageSize) : undefined,
    filterFns: {
      multiSelect: (row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }
    }
  });

  // Get pagination info from table state
  const paginationState = pagination ?? table.getState().pagination ?? { pageIndex: 0, pageSize: data.length };
  const currentPageIndex = paginationState.pageIndex;
  const pageSize = paginationState.pageSize;
  const page = currentPageIndex + 1;
  const totalPages = pageSize > 0 ? Math.ceil(data.length / pageSize) : 1;
  
  // Get filtered rows
  const filteredRows = table.getFilteredRowModel().rows.length;

  // Handle row deletion
  const handleDeleteRow = async (rowId: string) => {
    if (onDeleteRow) {
      await onDeleteRow(rowId);
    }
  };

  const renderEditableCell = (cell: any) => {
    const field = cell.column.id as keyof T
    const value = editForm?.[field]
    const renderer = editModeRenderers?.[field]

    // Check if the column is non-editable
    if (nonEditableColumns?.includes(cell.column.id)) {
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    }

    const fallback: T[keyof T] =
      typeof value === "number" ? 0 as T[keyof T] :
      typeof value === "boolean" ? false as T[keyof T] :
      "" as T[keyof T]

    if (renderer) {
      return renderer(value ?? fallback, (newValue) => onEditChange?.(field, newValue))
    }

    if (typeof value === "number") {
      return (
        <Input
          type="number"
          value={value ?? fallback}
          onChange={(e) => onEditChange?.(field, Number(e.target.value) as T[keyof T])}
        />
      )
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return (
        <Input
          type="date"
          value={value ?? fallback}
          onChange={(e) => onEditChange?.(field, e.target.value as T[keyof T])}
        />
      )
    }


    return (
      <Input
        value={value as string || ""}
        onChange={(e) => onEditChange?.(field, e.target.value as T[keyof T])}
      />
    )
  }



  return (
    <div className="border rounded-lg p-6 col-span-full">
      <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>


        {/* Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-1 items-center space-x-2">
            
            
            {/* Filter Textbox */}
            {searchQuery !== undefined && setSearchQuery && (
          <div className="relative">
            <Input
                placeholder="Filter by task name..."
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery?.(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
              disabled={!!editingRow}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                  onClick={() => setSearchQuery?.("")}
                disabled={!!editingRow}
              >
                <CrossIcon className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
            )}


            {/* Filter Dropdowns */}
            {searchQuery !== undefined && setSearchQuery && filterConfigs?.map((config) => (
              <FilterDropdown key={config.field} config={config} editingRow={editingRow} />
            ))}



            {(searchQuery !== undefined || (filterConfigs?.length ?? 0) > 0) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-dashed"
              onClick={() => {
                setSearchQuery?.("")
                filterConfigs?.forEach(config => config.onSelect([]))
              }}
              disabled={(!searchQuery && !filterConfigs?.some(config => config.selected.length > 0)) || !!editingRow}
          >
            Reset
          </Button>
            )}

            
            {/* Column Visibility Dropdown */}
            {searchQuery !== undefined && setSearchQuery && (
            <ColumnVisibilityDropdown
              columnOptions={columnOptions}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={onColumnVisibilityChange}
              editingRow={editingRow}
            />
            )}
        </div>
        <div className="flex items-center space-x-2">
          {AddItemDialog && onAddItem && (
            <AddItemDialog onAddItem={onAddItem} disabled={!!editingRow} />
          )}
        </div>
      </div>



        {/* Table */}
        <div className="rounded-md border">
          <Table className={cn("w-full table-fixed", tableClassName)}>


          {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                  {/* Select All checkbox */}
                  {showCheckboxes && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                        aria-label="Select all rows"
                      />
                  </TableHead>
                  )}

                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center space-x-2",
                              header.column.getCanSort() && "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ArrowUp className="h-4 w-4" />,
                              desc: <ArrowDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}

                  {showActions && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow> 
            ))}
          </TableHeader>


          {/* Table Body */}
          <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showCheckboxes ? 1 : 0) + (showActions ? 1 : 0)} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showCheckboxes ? 1 : 0) + (showActions ? 1 : 0)} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    data-state={showCheckboxes ? (row.getIsSelected() && "selected") : undefined}
                    className={tableClassName}
                  >

                    {/* Row checkbox */}
                    {showCheckboxes && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </TableCell>
                    )}

                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        //className="w-[200px]"
                        style={{
                          width: `${cell.column.getSize()}px`,
                          maxWidth: `${cell.column.columnDef.maxSize ?? cell.column.getSize()}px`,
                          minWidth: `${cell.column.columnDef.size ?? cell.column.getSize()}px`,
                        }}
                      >
                        {editingRow === row.original.id ? (
                          renderEditableCell(cell)
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}

                    {showActions && (
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
                            <Button variant="ghost" size="icon" onClick={() => onStartEdit?.(row.original)}>
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
                    )}
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>



        {/* Selected Rows */}
        {showCheckboxes && table.getFilteredSelectedRowModel().rows.length > 0 && (
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
        {showPagination && (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
              Displaying {filteredRows} of {" "}
              {data.length} {data.length === 1 ? "row" : "rows"} available
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
                  value={pagination?.pageSize?.toString() ?? "10"}
                  onValueChange={(value: string) =>
                    onPaginationChange?.((prev) => ({
                      ...prev,
                      pageSize: Number(value),
                      pageIndex: 0,
                    }))
                  }
            >
              <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue>{pagination?.pageSize?.toString() ?? "10"}</SelectValue>
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

              {pagination && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
                    onClick={() => {
                      if (pagination && onPaginationChange) {
                        onPaginationChange({
                          ...pagination,
                          pageIndex: pagination.pageIndex - 1
                        });
                      }
                    }}
              disabled={!table.getCanPreviousPage()}
            >
              <span>←</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
                    onClick={() => {
                      if (pagination && onPaginationChange) {
                        onPaginationChange({
                          ...pagination,
                          pageIndex: pagination.pageIndex + 1
                        });
                      }
                    }}
              disabled={!table.getCanNextPage()}
            >
              <span>→</span>
            </Button>
          </div>
              )}
        </div>
      </div>
        )}



      </div>
    </div>
  )
}
