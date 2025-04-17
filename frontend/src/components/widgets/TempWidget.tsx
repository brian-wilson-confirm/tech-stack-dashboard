import React from 'react';
import { DataTable } from "@/components/ui/data-table"
import { createColumns } from "@/components/ui/columns"
import { Task } from "@/components/data/schema"
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Cross2Icon, PlusCircledIcon, ViewVerticalIcon } from "@radix-ui/react-icons"
//import { priorities, statuses } from "@/components/data/data"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { VisibilityState } from "@tanstack/react-table"
import { TaskSheet } from "../ui/task-sheet"

interface TempWidgetProps {
    tasks: Task[]
    onTaskUpdate?: (updatedTask: Task) => void
}

export function TempWidget({ tasks, onTaskUpdate }: TempWidgetProps) {
    const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
    const [selectedPriority, setSelectedPriority] = React.useState<string[]>([])
    const [searchQuery, setSearchQuery] = React.useState<string>("")
    const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
    const [sheetOpen, setSheetOpen] = React.useState(false)
    const [editingRow, setEditingRow] = React.useState<string | null>(null)
    const [editedTask, setEditedTask] = React.useState<Task | null>(null)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        select: true,
        task_id: true,
        task: true,
        technology: true,
        subcategory: false,
        category: true,
        section: false,
        source: true,
        level: false,
        type: true,
        status: true,
        priority: true,
        progress: false,
        order: false,
        estimated_duration: true,
        done: false,
    })
    const [isPending, startTransition] = React.useTransition()

    // Filter tasks based on search query and selected filters
    const filteredTasks = React.useMemo(() => {
        const filtered = tasks.filter((task) => {
            const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(task.status)
            const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(task.priority)
            return matchesSearch && matchesStatus && matchesPriority
        })
        return filtered
    }, [tasks, searchQuery, selectedStatus, selectedPriority])

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("")
        setSelectedStatus([])
        setSelectedPriority([])
    }

    const handleTaskClick = React.useCallback((task: Task) => {
        if (editingRow) return // Don't open sheet while editing
        setSelectedTask(task)
        setSheetOpen(true)
    }, [editingRow])

    const handleEditClick = React.useCallback((task: Task) => {
        setEditingRow(task.task_id)
        setEditedTask({ ...task })
    }, [])

    const handleEditChange = React.useCallback((field: string, value: any) => {
        setEditedTask((prev) => {
            if (!prev) return null
            return {
                ...prev,
                [field]: value
            }
        })
    }, [])

    const handleSave = React.useCallback(async (task: Task) => {
        if (!editedTask) return

        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTask),
            })

            if (!response.ok) {
                throw new Error('Failed to update task')
            }

            // Update the tasks list with the edited task
            const updatedTask = await response.json()
            
            // Notify parent component about the update
            onTaskUpdate?.(updatedTask)
            
            // Reset editing state
            setEditingRow(null)
            setEditedTask(null)
        } catch (error) {
            console.error('Error updating task:', error)
            // Handle error (show toast, etc.)
        }
    }, [editedTask, onTaskUpdate])

    const handleCancel = React.useCallback(() => {
        setEditingRow(null)
        setEditedTask(null)
    }, [])

    const handleDelete = React.useCallback(async (task: Task) => {
        if (!confirm('Are you sure you want to delete this task?')) return

        try {
            const response = await fetch(`/api/tasks/${task.task_id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete task')
            }

            // Notify parent component about the deletion
            onTaskUpdate?.(task)
        } catch (error) {
            console.error('Error deleting task:', error)
            // Handle error (show toast, etc.)
        }
    }, [onTaskUpdate])

    const columns = React.useMemo(
        () =>
            createColumns({
                onTaskClick: handleTaskClick,
                editingRow,
                onEditChange: handleEditChange,
                onEdit: handleEditClick,
                onSave: handleSave,
                onCancel: handleCancel,
                onDelete: handleDelete,
                editedTask,
            }),
        [handleTaskClick, editingRow, handleEditChange, handleEditClick, handleSave, handleCancel, handleDelete, editedTask]
    )

  return (
        <div>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center space-x-2">
                            <div className="relative">
                                <Input
                                    placeholder="Filter tasks..."
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
                                        <Cross2Icon className="h-4 w-4" />
                                        <span className="sr-only">Clear search</span>
                                    </Button>
                                )}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingRow}>
                                        <PlusCircledIcon className="mr-2 h-4 w-4" />
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
                                            key={status.value}
                                            checked={selectedStatus.includes(status.value)}
                                            onCheckedChange={(checked) => {
                                                startTransition(() => {
                                                    checked
                                                        ? setSelectedStatus([...selectedStatus, status.value])
                                                        : setSelectedStatus(selectedStatus.filter((value) => value !== status.value))
                                                })
                                            }}
                                        >
                                            {status.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingRow}>
                                        <PlusCircledIcon className="mr-2 h-4 w-4" />
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
                                            key={priority.value}
                                            checked={selectedPriority.includes(priority.value)}
                                            onCheckedChange={(checked) => {
                                                startTransition(() => {
                                                    checked
                                                        ? setSelectedPriority([...selectedPriority, priority.value])
                                                        : setSelectedPriority(selectedPriority.filter((value) => value !== priority.value))
                                                })
                                            }}
                                        >
                                            {priority.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-dashed"
                                onClick={resetFilters}
                                disabled={(!searchQuery && selectedStatus.length === 0 && selectedPriority.length === 0) || !!editingRow}
                            >
                                Reset
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={!!editingRow}>
                                        <ViewVerticalIcon className="mr-2 h-4 w-4" />
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
                                        Title
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
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button disabled={!!editingRow}>
                                <PlusCircledIcon className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </div>
                    </div>
                    <DataTable 
                        data={filteredTasks} 
                        columns={columns}
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={setColumnVisibility}
                    />
                </div>
            </div>
            <TaskSheet
                task={selectedTask}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
    </div>
  );
}

export default TempWidget;