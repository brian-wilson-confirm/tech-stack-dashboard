import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface LearningGoalsFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const LearningGoalsForm: React.FC<LearningGoalsFormProps> = ({ onCancel, onSave }) => (
  <Tabs defaultValue="study-time" className="w-full">
    <TabsList className="mb-6">
      <TabsTrigger value="study-time">Study Time</TabsTrigger>
      <TabsTrigger value="task-quotas">Task Quotas</TabsTrigger>
      <TabsTrigger value="quiz-goals">Quiz Goals</TabsTrigger>
      <TabsTrigger value="difficulty-targets">Difficulty Targets</TabsTrigger>
      <TabsTrigger value="category-balance">Category Balance</TabsTrigger>
    </TabsList>
    <TabsContent value="study-time">
      <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
        <div>
          <Label htmlFor="weekly-goal" className="block text-sm font-medium mb-1">Weekly Study Time Goal (hours)</Label>
          <Input id="weekly-goal" type="number" min={0} step={0.5} placeholder="10" />
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">10 hours/week</span> — Sets expected total learning time</p>
        </div>
        <div>
          <Label htmlFor="daily-goal" className="block text-sm font-medium mb-1">Daily Time Goal (minutes)</Label>
          <Input id="daily-goal" type="number" min={0} step={1} placeholder="90" />
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">90 mins/day</span> — Micro-targets to help with consistency</p>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Days a Week to Study</Label>
          <div className="flex gap-2 mt-1">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
              <label key={day} className="flex items-center gap-1 text-sm">
                <Checkbox id={`day-${day}`} />
                {day}
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">Mon, Wed, Fri, Sat</span> — Used for streaks and pacing logic</p>
        </div>
        <div>
          <Label htmlFor="preferred-hours" className="block text-sm font-medium mb-1">Time Blocks / Preferred Hours</Label>
          <Input id="preferred-hours" placeholder="Mornings, 8–10pm" />
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">Mornings</span>, <span className="bg-muted px-1 rounded">8–10pm</span> — Optional, but useful for scheduling & reminders</p>
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </TabsContent>
    <TabsContent value="task-quotas">
      <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
        <div>
          <Label htmlFor="tasks-per-day" className="block text-sm font-medium mb-1">Tasks per Day</Label>
          <Input id="tasks-per-day" type="number" min={0} step={1} placeholder="3" />
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">3 tasks/day</span></p>
        </div>
        <div>
          <Label htmlFor="tasks-per-week" className="block text-sm font-medium mb-1">Tasks per Week</Label>
          <Input id="tasks-per-week" type="number" min={0} step={1} placeholder="15" />
          <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">15 tasks/week</span></p>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Task Types to Emphasize</Label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {['code','quiz','build','review','read','write'].map(type => (
              <label key={type} className="flex items-center gap-1 text-sm">
                <Checkbox id={`task-type-${type}`} />
                <span className="bg-muted px-1 rounded">{type}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Focus on <span className="bg-muted px-1 rounded">code</span>, <span className="bg-muted px-1 rounded">quiz</span>, <span className="bg-muted px-1 rounded">build</span></p>
        </div>
        <div>
          <Label htmlFor="min-completion" className="block text-sm font-medium mb-1">Minimum Completion % per Category</Label>
          <Input id="min-completion" type="number" min={0} max={100} step={1} placeholder="10" />
          <p className="text-xs text-muted-foreground mt-1">e.g., 10% from each major category per week</p>
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </TabsContent>
    <TabsContent value="quiz-goals">
      <div className="p-6 text-muted-foreground">Quiz Goals form goes here.</div>
    </TabsContent>
    <TabsContent value="difficulty-targets">
      <div className="p-6 text-muted-foreground">Difficulty Targets form goes here.</div>
    </TabsContent>
    <TabsContent value="category-balance">
      <div className="p-6 text-muted-foreground">Category Balance form goes here.</div>
    </TabsContent>
  </Tabs>
);

export default LearningGoalsForm; 