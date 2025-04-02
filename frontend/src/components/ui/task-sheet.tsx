import React from 'react'
import { Task } from '@/components/data/schema'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { priorities, statuses } from '../data/data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface TaskSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskSheet({ task, open, onOpenChange }: TaskSheetProps) {
  if (!task) return null

  const status = statuses.find((s) => s.value === task.status)
  const priority = priorities.find((p) => p.value === task.priority)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-2">
            <span>{task.task_id}</span>
            <Badge variant="outline">{status?.label}</Badge>
            <Badge variant="outline">{priority?.label}</Badge>
          </SheetTitle>
          <SheetDescription className="text-base">
            {task.task}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm font-medium">Details</h3>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Technology</span>
                  <span className="text-sm col-span-3">{task.technology}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm col-span-3">{task.category}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Subcategory</span>
                  <span className="text-sm col-span-3">{task.subcategory}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Section</span>
                  <span className="text-sm col-span-3">{task.section}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm col-span-3">{task.source}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm col-span-3">{task.type}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <span className="text-sm col-span-3">{task.level}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium">Progress</h3>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm col-span-3">{task.progress}%</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Est. Duration</span>
                  <span className="text-sm col-span-3">{task.estimated_duration} hrs</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Actual Duration</span>
                  <span className="text-sm col-span-3">{task.actual_duration} hrs</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Order</span>
                  <span className="text-sm col-span-3">{task.order}</span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Done</span>
                  <span className="text-sm col-span-3">{task.done ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium">Dates</h3>
              <Separator className="my-4" />
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm col-span-3">
                    {new Date(task.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="text-sm col-span-3">
                    {new Date(task.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 