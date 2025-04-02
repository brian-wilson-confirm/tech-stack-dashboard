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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface TempWidgetProps {
    tasks: Task[]
}

const TempWidget: React.FC<TempWidgetProps> = ({ tasks }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
    const [selectedPriority, setSelectedPriority] = React.useState<string[]>([])
    const [searchQuery, setSearchQuery] = React.useState<string>("")
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
                            <Button variant="outline" size="sm" className="h-8 border-dashed">
                                <ViewVerticalIcon className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button>
                                <PlusCircledIcon className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </div>
                    </div>
                    <DataTable data={filteredTasks} columns={columns} />
                </div>
            </div>
        </div>
    );
};

export default TempWidget;