import React from 'react';
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/ui/columns"
import { Task } from "@/components/data/schema"
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Cross2Icon, PlusCircledIcon, ViewVerticalIcon } from "@radix-ui/react-icons"
import { priorities, statuses } from "../data/data"
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

interface TempWidgetProps {
    tasks: Task[]
}

const TempWidget: React.FC<TempWidgetProps> = ({ tasks }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
    const [selectedPriority, setSelectedPriority] = React.useState<string[]>([])
    const [searchQuery, setSearchQuery] = React.useState<string>("")
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
        return tasks.filter((task) => {
            const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(task.status)
            const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(task.priority)
            return matchesSearch && matchesStatus && matchesPriority
        })
    }, [tasks, searchQuery, selectedStatus, selectedPriority])

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("")
        setSelectedStatus([])
        setSelectedPriority([])
    }

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
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        <Cross2Icon className="h-4 w-4" />
                                        <span className="sr-only">Clear search</span>
                                    </Button>
                                )}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-dashed">
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
                                    <Button variant="outline" size="sm" className="h-8 border-dashed">
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
                                disabled={!searchQuery && selectedStatus.length === 0 && selectedPriority.length === 0}
                            >
                                Reset
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 border-dashed">
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
                            <Button>
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
        </div>
    );
};

export default TempWidget;