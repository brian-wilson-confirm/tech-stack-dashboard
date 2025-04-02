import React from 'react';
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/ui/columns"
import { Task } from "@/components/data/schema"
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';


const TempWidget: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    return (
        <div>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center space-x-2">
                            <Input placeholder="Filter tasks..." className="h-8 w-[150px] lg:w-[250px]" />
                            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">Status</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">Priority</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">View</Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button>Add Task</Button>
                        </div>
                    </div>
                    <DataTable data={tasks} columns={columns} />
                </div>
            </div>
        </div>
    );
};


export default TempWidget;