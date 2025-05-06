import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";


interface LearningGoalsFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TASK_TYPES = ['Read','Watch','Listen','Research','Review','Install', 'Build', 'Code', 'Debug'];

const LearningGoalsForm: React.FC<LearningGoalsFormProps> = ({ onCancel, onSave }) => {
  const [taskTypeValues, setTaskTypeValues] = useState<{[key: string]: number}>(
    Object.fromEntries(TASK_TYPES.map(type => [type, 5]))
  );
  const [difficultyRange, setDifficultyRange] = useState<string[]>([]);
  const [difficultyBias, setDifficultyBias] = useState("Balanced");
  const [minTasksPerLevel, setMinTasksPerLevel] = useState<{[key: string]: number}>({});

  return (
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
            <div className="flex flex-col gap-4 mt-1">
              {TASK_TYPES.map(type => (
                <div key={type} className="flex items-center gap-4">
                  <span className="w-20 text-xs font-normal text-muted-foreground capitalize pl-3">{type}</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={taskTypeValues[type]}
                    onChange={e => setTaskTypeValues(v => ({ ...v, [type]: Number(e.target.value) }))}
                    className="flex-1 accent-primary"
                    id={`task-type-slider-${type}`}
                  />
                  <span className="w-8 text-xs text-muted-foreground text-right">{taskTypeValues[type]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Set emphasis for each type: 1 (low) to 10 (high). Example: <span className="bg-muted px-1 rounded">code: 8</span>, <span className="bg-muted px-1 rounded">quiz: 6</span>, <span className="bg-muted px-1 rounded">build: 9</span></p>
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
        <form className="space-y-6 max-w-xl p-6" onSubmit={e => { e.preventDefault(); onSave(); }}>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-2">Setting</th>
                <th className="text-left pb-2">Type</th>
                <th className="text-left pb-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 font-medium">Quizzes per Week</td>
                <td><code className="bg-muted px-2 py-1 rounded">number</code></td>
                <td><Input type="number" min={0} className="w-32" placeholder="3" /></td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Minimum Passing Score</td>
                <td><code className="bg-muted px-2 py-1 rounded">number (%)</code></td>
                <td><Input type="number" min={0} max={100} className="w-32" placeholder="80" /></td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Daily Quiz Streak Goal</td>
                <td><code className="bg-muted px-2 py-1 rounded">boolean</code> <span className="text-xs text-muted-foreground">or</span> <code className="bg-muted px-2 py-1 rounded">number</code></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={0} className="w-20" placeholder="1" />
                    <span className="text-xs text-muted-foreground">quiz/day</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Review Missed Quiz Topics Weekly</td>
                <td><code className="bg-muted px-2 py-1 rounded">toggle</code></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-xs text-muted-foreground">enabled</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="difficulty-targets">
        <form className="space-y-6 max-w-xl p-6" onSubmit={e => { e.preventDefault(); onSave(); }}>
          <div>
            <Label className="block text-sm font-medium mb-1">Difficulty Range</Label>
            <div className="flex gap-4">
              {["Beginner", "Intermediate", "Advanced"].map(level => (
                <label key={level} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={difficultyRange.includes(level)}
                    onChange={e => {
                      if (e.target.checked) {
                        setDifficultyRange(prev => [...prev, level]);
                      } else {
                        setDifficultyRange(prev => prev.filter(l => l !== level));
                      }
                    }}
                  />
                  {level}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Range of tasks to focus on (e.g., Intermediate → Advanced)</p>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Difficulty Bias</Label>
            <div className="flex gap-4">
              {["Balanced", "Push Higher", "Reinforce Basics"].map(bias => (
                <label key={bias} className="flex items-center gap-1 text-sm">
                  <input
                    type="radio"
                    name="difficulty-bias"
                    checked={difficultyBias === bias}
                    onChange={() => setDifficultyBias(bias)}
                  />
                  {bias}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Informs AI task weighting</p>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Minimum Tasks per Level</Label>
            <div className="flex flex-col gap-2">
              {["Beginner", "Intermediate", "Advanced"].map(level => (
                <div key={level} className="flex items-center gap-2">
                  <span className="w-28 text-xs font-normal text-muted-foreground">{level}</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="1"
                    value={minTasksPerLevel[level] || ''}
                    onChange={e => setMinTasksPerLevel(v => ({ ...v, [level]: Number(e.target.value) }))}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">/week</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Optional level balance targets (e.g., Beginner: 1/week, Advanced: 2/week)</p>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="category-balance">
        <div className="p-6 text-muted-foreground">Category Balance form goes here.</div>
      </TabsContent>
    </Tabs>
  );
};

export default LearningGoalsForm; 