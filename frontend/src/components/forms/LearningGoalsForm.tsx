import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";


interface LearningGoalsFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TASK_TYPES = ['Read','Watch','Listen','Research','Review','Install', 'Build', 'Code', 'Debug'];

const LearningGoalsForm: React.FC<LearningGoalsFormProps> = ({ onCancel, onSave }) => {
  const { toast } = useToast();
  const [taskTypeValues, setTaskTypeValues] = useState<{[key: string]: number}>(
    Object.fromEntries(TASK_TYPES.map(type => [type, 5]))
  );
  const [difficultyRange, setDifficultyRange] = useState<string[]>([]);
  const [difficultyBias, setDifficultyBias] = useState("Balanced");
  const [minTasksPerLevel, setMinTasksPerLevel] = useState<{[key: string]: number}>({});
  const [targetCategoryDistribution, setTargetCategoryDistribution] = useState<{[key: string]: number}>({});
  const [enforceBalance, setEnforceBalance] = useState(false);
  const [minSubcategoriesPerCategory, setMinSubcategoriesPerCategory] = useState<{[key: string]: number}>({});
  const [autoAlertOnImbalance, setAutoAlertOnImbalance] = useState(false);
  const [daysToStudy, setDaysToStudy] = useState<string[]>([]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Gather all config values from state and controlled inputs
    // (You may want to add refs or state for uncontrolled inputs if needed)
    const config: any = {
      // Example for state values:
      taskTypeValues,
      difficultyRange,
      difficultyBias,
      minTasksPerLevel,
      targetCategoryDistribution,
      enforceBalance,
      minSubcategoriesPerCategory,
      autoAlertOnImbalance,
      // Add more fields as needed from controlled inputs
    };

    // Gather values from uncontrolled inputs (study-time, task-quotas, quiz-goals)
    const form = e.target as HTMLFormElement;
    // Study Time
    config.weeklyGoal = (form.querySelector('#weekly-goal') as HTMLInputElement)?.value;
    config.dailyGoal = (form.querySelector('#daily-goal') as HTMLInputElement)?.value;
    config.preferredHours = (form.querySelector('#preferred-hours') as HTMLInputElement)?.value;
    config.daysToStudy = Array.from(form.querySelectorAll('input[id^="day-"]:checked')).map((el: any) => el.nextSibling.textContent);
    // Task Quotas
    config.tasksPerDay = (form.querySelector('#tasks-per-day') as HTMLInputElement)?.value;
    config.tasksPerWeek = (form.querySelector('#tasks-per-week') as HTMLInputElement)?.value;
    config.minCompletion = (form.querySelector('#min-completion') as HTMLInputElement)?.value;
    // Quiz Goals
    config.quizzesPerWeek = (form.querySelector('input[placeholder="3"]') as HTMLInputElement)?.value;
    config.minPassingScore = (form.querySelector('input[placeholder="80"]') as HTMLInputElement)?.value;
    config.dailyQuizStreakGoal = (form.querySelector('input[placeholder="1"]') as HTMLInputElement)?.value;
    config.reviewMissedQuizTopicsWeekly = !!form.querySelector('input[type="checkbox"]:checked');

    try {
      const res = await fetch('/api/settings/study-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast({
        title: "Settings saved",
        description: "Your configuration was saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
    }
  };

  const handleSaveStudyTime = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const config = {
      daily_goal: (form.querySelector('#daily-goal') as HTMLInputElement)?.value,
      weekly_goal: (form.querySelector('#weekly-goal') as HTMLInputElement)?.value,
      preferred_hours: (form.querySelector('#preferred-hours') as HTMLInputElement)?.value,
      days_to_study: daysToStudy,
    };
  
    try {
      const res = await fetch('/api/settings/study-time', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({
        title: "Settings saved",
        description: "Your study time configuration was saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your study time settings.",
        variant: "destructive",
      });
    }
  };

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
        <form className="space-y-6 max-w-xl" onSubmit={handleSaveStudyTime}>
          <div>
            <Label htmlFor="daily-goal" className="block text-sm font-medium mb-1">Daily Study Time Goal (hours)</Label>
            <Input id="daily-goal" type="number" min={0} step={1} placeholder="5" />
            <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">5 hours/day</span> — Micro-targets to help with consistency</p>
          </div>
          <div>
            <Label htmlFor="weekly-goal" className="block text-sm font-medium mb-1">Weekly Study Time Goal (hours)</Label>
            <Input id="weekly-goal" type="number" min={0} step={0.5} placeholder="10" />
            <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">10 hours/week</span> — Sets expected total learning time</p>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Days a Week to Study</Label>
            <div className="flex gap-2 mt-1">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                <label key={day} className="flex items-center gap-1 text-sm">
                  <Checkbox
                    id={`day-${day}`}
                    checked={daysToStudy.includes(day)}
                    onCheckedChange={checked => {
                      setDaysToStudy(prev =>
                        checked ? [...prev, day] : prev.filter(d => d !== day)
                      );
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Example: Mon, Wed, Fri, Sat — Used for streaks and pacing logic</p>
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
        <form className="space-y-6 max-w-xl" onSubmit={handleSave}>
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
        <form className="space-y-6 max-w-xl p-6" onSubmit={handleSave}>
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
        <form className="space-y-6 max-w-xl p-6" onSubmit={handleSave}>
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
        <form className="space-y-6 max-w-xl p-6" onSubmit={handleSave}>
          {/* Target Category Distribution */}
          <div>
            <Label className="block text-sm font-medium mb-1">Target Category Distribution</Label>
            <div className="flex flex-col gap-4">
              {['Frontend', 'DevOps', 'Backend', 'Security'].map(category => (
                <div key={category} className="flex items-center gap-2">
                  <span className="w-24 text-xs font-normal text-muted-foreground">{category}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={targetCategoryDistribution[category] || 0}
                    onChange={e => setTargetCategoryDistribution(v => ({ ...v, [category]: Number(e.target.value) }))}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-12 text-xs text-muted-foreground text-right">{targetCategoryDistribution[category] || 0}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Used for LLM to prioritize new tasks (e.g., Frontend 20%, DevOps 15%)</p>
          </div>
          {/* Enforce Balance Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enforce-balance"
              checked={enforceBalance}
              onChange={e => setEnforceBalance(e.target.checked)}
            />
            <Label htmlFor="enforce-balance" className="text-sm font-medium">Enforce Balance</Label>
            <span className="text-xs text-muted-foreground">If true, deprioritize oversaturated categories</span>
          </div>
          {/* Min Subcategories per Category */}
          <div>
            <Label className="block text-sm font-medium mb-1">Minimum Subcategories per Category</Label>
            <div className="flex flex-col gap-2">
              {['Frontend', 'DevOps', 'Backend', 'Security'].map(category => (
                <div key={category} className="flex items-center gap-2">
                  <span className="w-24 text-xs font-normal text-muted-foreground">{category}</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="2"
                    value={minSubcategoriesPerCategory[category] || ''}
                    onChange={e => setMinSubcategoriesPerCategory(v => ({ ...v, [category]: Number(e.target.value) }))}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">per category</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Promotes coverage of full category depth (e.g., ≥2 per category)</p>
          </div>
          {/* Auto Alert on Imbalance Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-alert-on-imbalance"
              checked={autoAlertOnImbalance}
              onChange={e => setAutoAlertOnImbalance(e.target.checked)}
            />
            <Label htmlFor="auto-alert-on-imbalance" className="text-sm font-medium">Auto Alert on Imbalance</Label>
            <span className="text-xs text-muted-foreground">Triggers nudges like "Security falling behind"</span>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default LearningGoalsForm; 