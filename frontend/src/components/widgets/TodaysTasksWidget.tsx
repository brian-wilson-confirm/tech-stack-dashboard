import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterFn, SortingState, VisibilityState } from '@tanstack/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Task } from '@/components/data/schema'
import { getPriorityColor } from '@/styles/style'
import { capitalizeWords } from '@/lib/utils'
import { getStatusColor } from '@/styles/style'
import { PriorityEnum, StatusEnum } from '@/types/enums'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'
import { TaskSheet } from '@/components/ui/task-sheet'
import { DataTableComponent } from '../tables/data-table'



/*******************
  INITIAL VISIBLE COLUMNS
********************/
const initialVisibleColumns = {
    id: false, 
    task_id: true,
    task: true,
    technology: false,
    subcategory: false,
    category: false,
    topics: false,
    section: false,
    source: false,
    level: true,
    type: false,
    status: true,
    priority: true,
    progress: false,
    order: false,
    due_date: false,
    start_date: false,
    end_date: false,
    estimated_duration: true,
    actual_duration: false,
    done: false
}



export default function TodaysTasksWidget() {

  /*******************
    STATE VARIABLES
  ********************/
  // Fetching Data
  const [rows, setRows] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedRows, setHasFetchedRows] = useState(false);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibilityState>(initialVisibleColumns);

  // Row Sorting
  const [sortConfigs, setSortConfigs] = useState<SortingState>([]);

  // Row Selection
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRow, setSelectedRow] = useState<Task | null>(null);  

  // Row Sheet
  const [sheetOpen, setSheetOpen] = useState(false);
    


  /*******************
    COLUMN DEFINITIONS
  ********************/
  const columns: ColumnDef<Task>[] = [
    { accessorKey: "task_id", header: "Task ID", 
        enableSorting: true,
        cell: ({ row }) => (
        <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => handleRowClick(row.original)}
        >
            {row.original.task_id}
        </Button>
    )},
    { accessorKey: "task", header: "Task", 
        enableSorting: true,
        cell: ({ row }) => (
        <div className="max-w-[250px] truncate">
            {row.original.task}
        </div>
        )
    },
    { accessorKey: "level", header: "Level",
      enableSorting: true,
      cell: ({ row }) => (
          <span>{capitalizeWords(row.original.lesson.level)}</span>
      ),
    },
    { accessorKey: "type", header: "Type", 
        enableSorting: true,
        cell: ({ row }) => (
        <span>{capitalizeWords(row.original.type.name)}</span>
    )},
    { accessorKey: "estimated_duration", header: "Est. Duration",
        enableSorting: true,
        cell: ({ row }) => {
          const duration = row.original.estimated_duration; // example: "PT2H30M"
          if (!duration) return null;
      
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      
          if (!match) return null;
      
          const hours = match[1] ? parseInt(match[1], 10) : 0;
          const minutes = match[2] ? parseInt(match[2], 10) : 0;
      
          let display = "";
          if (hours > 0) display += `${hours} h `;
          if (minutes > 0) display += `${minutes} m`;
      
          return (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{display.trim() || "0 m"}</span>
            </div>
          );
        }
    },
    { accessorKey: "status", header: "Status",
        enableSorting: true,
        filterFn: ((row, columnId, filterValue) => {
          return filterValue.includes(row.getValue(columnId));
        }) as FilterFn<Task>,
        cell: ({ row }) => (
          <Badge variant="secondary" className={`${getStatusColor(row.original.status.name as StatusEnum)} text-white`}>
            {capitalizeWords((row.original.status.name ?? '').replace('_', ' '))}
          </Badge>
        ),
    },
    { accessorKey: "priority", header: "Priority",
        enableSorting: true,
        filterFn: ((row, columnId, filterValue) => {
          return filterValue.includes(row.getValue(columnId));
        }) as FilterFn<Task>,
        cell: ({ row }) => (
          <Badge variant="secondary" className={`${getPriorityColor(row.original.priority.name as PriorityEnum)} text-white`}>
            {capitalizeWords(row.original.priority.name)}
          </Badge>
        ),
    },
    { accessorKey: "progress", header: "Progress", 
        enableSorting: true,
        cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <Progress value={row.original.progress} className="w-[60px]" />
        <span className="text-sm">{row.original.progress}%</span>
        </div>
    )},
    { accessorKey: "due_date", header: "Due Date", 
        enableSorting: true,
        cell: ({ row }) => {
        const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
        }
        return <span>{toLocalInputDate(row.original.due_date)}</span>
    }}, 
    { accessorKey: "start_date", header: "Start Date", 
        enableSorting: true,
        cell: ({ row }) => {
        const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
        }
        return <span>{toLocalInputDate(row.original.start_date)}</span>
    }}
  ]



  /***********************
    PAGE LOAD
  ***********************/
  // Fetch Row Data
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/detailed');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setRows(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };


  // Fetch Row Data on Page Load
  useEffect(() => {
    if (!hasFetchedRows) {
      fetchRows();
      setHasFetchedRows(true);
    }
  }, []);



  /*******************
    ADDITIONAL FUNCTIONS
  ********************/



  /***********************
    ROW EDITING
  ***********************/
  


  /***********************
    ROW INTERACTION
  ***********************/
  const handleRowClick = useCallback((row: Task) => {
    setSelectedRow(row)
    setSheetOpen(true)
  }, [])
      
    
    
  /*******************
    RENDER CELLS IN EDIT-MODE
  ********************/



  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
          <DataTableComponent
            title="Today's Tasks"
            data={rows}
            isLoading={isLoading}
            columns={columns}
            columnOptions={undefined}
            visibleColumns={visibleColumns}
            columnFilters={undefined}
            onColumnVisibilityChange={setVisibleColumns}
            onColumnFiltersChange={undefined}
            pagination={undefined}
            onPaginationChange={undefined}
            maxVisibleRows={10}
            filterConfigs={undefined}
            searchQuery={undefined}
            setSearchQuery={undefined}
            sortConfigs={sortConfigs}
            onSortChange={setSortConfigs}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            editForm={undefined}
            editModeRenderers={undefined}
            nonEditableColumns={undefined}
            onStartEdit={undefined}
            onEditChange={undefined}
            editingRow={undefined}
            onSaveEdit={undefined}
            onCancelEdit={undefined}
            onDeleteRow={undefined}
            showCheckboxes={true}
            showActions={false}
            showPagination={false}
            AddItemDialog={undefined}
            onAddItem={undefined}
          />

          <TaskSheet
            task={selectedRow}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          />
    </div>
  )
} 