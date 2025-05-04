import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SortingState, VisibilityState } from '@tanstack/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Task } from '@/components/data/schema'
import { getPriorityColor } from '@/styles/style'
import { getLevelColor } from '@/styles/style'
import { capitalizeWords } from '@/lib/utils'
import { getStatusColor } from '@/styles/style'
import { PriorityEnum, StatusEnum, LevelEnum } from '@/types/enums'
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

  // Inline edit state for status
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  // Status options fetched from API
  const [statusOptions, setStatusOptions] = useState<{ id: string; name: string }[]>([]);

  // Fetch status options on mount
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch('/api/tasks/statuses');
        if (!response.ok) throw new Error('Failed to fetch status options');
        const data = await response.json();
        setStatusOptions(data); // assuming data is [{ id, name }, ...]
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch status options",
          variant: "destructive",
        });
      }
    };
    fetchStatusOptions();
  }, []);

  // Update function for status (by id and name)
  const updateStatus = async (rowId: string, newStatusId: string, newStatusName: string) => {
    try {
      console.log("Updating status for rowId:", rowId, "with newStatusId:", newStatusId, "and newStatusName:", newStatusName);
      const response = await fetch(`/api/tasks/${rowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_id: newStatusId }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setRows(prevRows => prevRows.map(row =>
        row.id === rowId
          ? { ...row, status: { id: newStatusId, name: newStatusName } }
          : row
      ));
      toast({
        title: 'Success',
        description: 'Status updated successfully',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  // Set status to completed when a row is selected
  const [prevRowSelection, setPrevRowSelection] = useState(rowSelection);

  useEffect(() => {
    const completedStatus = statusOptions.find(opt => opt.name.toLowerCase() === "completed");
    const notStartedStatus = statusOptions.find(opt => opt.name.toLowerCase() === "not_started");
    if (!completedStatus || !notStartedStatus) return;

    // Handle checked (set to completed)
    Object.keys(rowSelection).forEach(rowIndex => {
      if (rowSelection[rowIndex]) {
        const row = rows[Number(rowIndex)];
        if (row && row.status.name.toLowerCase().replace(/_/g, '') !== "completed") {
          updateStatus(row.id, completedStatus.id, completedStatus.name);
        }
      }
    });

    // Handle unchecked (set to not_started)
    Object.keys(prevRowSelection).forEach(rowIndex => {
      if (prevRowSelection[rowIndex] && !rowSelection[rowIndex]) {
        const row = rows[Number(rowIndex)];
        if (row && row.status.name.toLowerCase().replace(/_/g, '') !== "notstarted") {
          updateStatus(row.id, notStartedStatus.id, notStartedStatus.name);
        }
      }
    });

    setPrevRowSelection(rowSelection);
  }, [rowSelection, statusOptions]);

  useEffect(() => {
    // Sync checkboxes with completed status on page load or data change
    const completedStatus = statusOptions.find(opt => opt.name.toLowerCase() === "completed");
    if (!completedStatus) return;
    const newRowSelection: Record<string, boolean> = {};
    rows.forEach((row, idx) => {
      if (row.status.name.toLowerCase() === completedStatus.name.toLowerCase()) {
        newRowSelection[idx] = true;
      }
    });
    setRowSelection(newRowSelection);
  }, [rows, statusOptions]);



  /*******************
    COLUMN DEFINITIONS
  ********************/
  const columns: ColumnDef<Task>[] = [
    { accessorKey: "task_id", header: "Task ID", 
        enableSorting: true,
        size: 95,
        maxSize: 95,
        cell: ({ row }) => (
            <div className="w-24">
                <Button
                    variant="link"
                    className="p-1 h-auto font-normal"
                    onClick={() => handleRowClick(row.original)}
                >
                    {row.original.task_id}
                </Button>
            </div>
        )
    },
    { accessorKey: "task", header: "Task",
      enableSorting: true,
      size: undefined,
      cell: ({ row }) => (
        <div className="truncate min-w-0">{row.original.task}</div>
      ),
    },
    { accessorKey: "estimated_duration", header: "Est. Duration",
      enableSorting: true,
      size: 96,
      maxSize: 96,
      cell: ({ row }) => {
        const duration = row.original.estimated_duration;
        if (!duration) return null;
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        if (!match) return null;
        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        let display = "";
        if (hours > 0) display += `${hours} h `;
        if (minutes > 0) display += `${minutes} m`;
        return (
          <div className="w-24 truncate">
            <Clock className="h-4 w-4 inline-block mr-1" />
            <span>{display.trim() || "0 m"}</span>
          </div>
        );
      },
    },
    { accessorKey: "level", header: "Level",
      enableSorting: true,
      size: 120,
      maxSize: 120,
      cell: ({ row }) => (
        <div className="w-24">
          <Badge variant="secondary" className={`${getLevelColor(row.original.lesson.level as LevelEnum)} text-white`}>
            {capitalizeWords(row.original.lesson.level)}
          </Badge>
        </div>
      ),
    },
    { accessorKey: "priority", header: "Priority",
      enableSorting: true,
      size: 90,
      maxSize: 90,
      cell: ({ row }) => (
        <div className="w-24">
          <Badge variant="secondary" className={`${getPriorityColor(row.original.priority.name as PriorityEnum)} text-white`}>
            {capitalizeWords(row.original.priority.name)}
          </Badge>
        </div>
      ),
    },
    { accessorKey: "status", header: "Status",
      enableSorting: true,
      size: 120,
      maxSize: 120,
      cell: ({ row }) => {
        const isHovered = hoveredRowId === row.original.id;
        const isEditing = editingRowId === row.original.id;
        const currentStatusId = row.original.status.id;
        const currentStatusName = row.original.status.name;
        return (
          <div
            className="w-24"
            onMouseEnter={() => setHoveredRowId(row.original.id)}
            onMouseLeave={() => {
              setHoveredRowId(null);
              setEditingRowId(null);
            }}
            onClick={() => setEditingRowId(row.original.id)}
            style={{ cursor: "pointer" }}
          >
            {isEditing ? (
              <select
                value={currentStatusId}
                onChange={async e => {
                  const selected = statusOptions.find(opt => String(opt.id) === String(e.target.value));
                  if (selected) {
                    await updateStatus(row.original.id, selected.id, selected.name);
                  }
                  setEditingRowId(null);
                }}
                onBlur={() => setEditingRowId(null)}
                autoFocus
                className="border rounded px-2 py-1 text-xs"
              >
                {statusOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {capitalizeWords(option.name.replace('_', ' '))}
                  </option>
                ))}
              </select>
            ) : (
              <Badge
                variant="secondary"
                className={`${getStatusColor(currentStatusName as StatusEnum)} text-white`}
              >
                {capitalizeWords((currentStatusName ?? '').replace('_', ' '))}
              </Badge>
            )}
          </div>
        );
      },
    }
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