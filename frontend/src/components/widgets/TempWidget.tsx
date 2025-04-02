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
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

const TempWidget: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
    const [selectedPriority, setSelectedPriority] = React.useState<string[]>([])
    const [isPending, startTransition] = React.useTransition()

    return (
        <div>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center space-x-2">
                            <Input
                                placeholder="Filter tasks..."
                                className="h-8 w-[150px] lg:w-[250px]"
                            />
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
                                    {selectedStatus.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => setSelectedStatus([])}
                                                className="justify-center text-center"
                                            >
                                                Clear filters
                                            </DropdownMenuItem>
                                        </>
                                    )}
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
                                    {selectedPriority.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => setSelectedPriority([])}
                                                className="justify-center text-center"
                                            >
                                                Clear filters
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                    <DataTable data={tasks} columns={columns} />
                </div>
            </div>
        </div>
    );
};

export default TempWidget;