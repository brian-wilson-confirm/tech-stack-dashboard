import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";


interface LearningGoalsFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TASK_TYPES = ['Reading','Watching','Listening','Researching','Reviewing','Installing', 'Building', 'Coding', 'Debugging'];

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
  const [dailyGoal, setDailyGoal] = useState<number | ''>('');
  const [weeklyGoal, setWeeklyGoal] = useState<number | ''>('');
  const [preferredHours, setPreferredHours] = useState<string>('');
  const [daysToStudy, setDaysToStudy] = useState<string[]>([]);
  const [tasksPerDay, setTasksPerDay] = useState<number | ''>('');
  const [tasksPerWeek, setTasksPerWeek] = useState<number | ''>('');
  const [minCompletion, setMinCompletion] = useState<number | ''>('');
  const [quizzesPerWeek, setQuizzesPerWeek] = useState<number | ''>('');
  const [minPassingScore, setMinPassingScore] = useState<number | ''>('');
  const [dailyQuizStreakGoal, setDailyQuizStreakGoal] = useState<number | ''>('');
  const [reviewMissedQuizTopicsWeekly, setReviewMissedQuizTopicsWeekly] = useState<boolean>(false);
  const [loadingStudyTime, setLoadingStudyTime] = useState<boolean>(true);
  const [loadingTaskQuotas, setLoadingTaskQuotas] = useState(true);
  const [loadingQuizGoals, setLoadingQuizGoals] = useState(true);
  
  
  useEffect(() => {
    setLoadingStudyTime(true);
    fetch("/api/settings/learning-goals/study-time")
      .then(res => res.json())
      .then(data => {
        setDailyGoal(data.daily_goal ?? '');
        setWeeklyGoal(data.weekly_goal ?? '');
        setDaysToStudy((data.days_to_study ?? []).map(
          (d: string) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
        ));
        setPreferredHours(data.preferred_hours ?? '');
      })
      .finally(() => setLoadingStudyTime(false));
  }, []);

  useEffect(() => {
    setLoadingTaskQuotas(true);
    fetch("/api/settings/learning-goals/task-quotas")
      .then(res => res.json())
      .then(data => {
        setTasksPerDay(data.tasks_per_day ?? '');
        setTasksPerWeek(data.tasks_per_week ?? '');
        setTaskTypeValues(data.task_type_values ?? {});
      })
      .finally(() => setLoadingTaskQuotas(false));
  }, []);

  useEffect(() => {
    setLoadingQuizGoals(true);
    fetch("/api/settings/learning-goals/quiz-goals")
      .then(res => res.json())
      .then(data => {
        setQuizzesPerWeek(data.quizzes_per_week ?? '');
        setDailyQuizStreakGoal(data.daily_quiz_goal ?? '');
        setMinPassingScore(data.minimum_passing_score ?? '');
        setReviewMissedQuizTopicsWeekly(data.review_missed_topics_weekly ?? false);
      })
      .finally(() => setLoadingQuizGoals(false));
  }, []);
  

  /*
  const transformTaskTypeKeys = (obj: {[key: string]: number}) => {
    const result: {[key: string]: number} = {};
    Object.entries(obj).forEach(([key, value]) => {
      let newKey = key.toLowerCase();
      if (newKey === 'code') newKey = 'coding';
      else if (newKey === 'debug') newKey = 'debugging';
      else newKey = newKey + 'ing';
      result[newKey] = value;
    });
    return result;
  };*/


  const handleSaveStudyTime = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      daily_goal: dailyGoal,
      weekly_goal: weeklyGoal,
      preferred_hours: preferredHours,
      days_to_study: daysToStudy,
    };
  
    try {
      const res = await fetch('/api/settings/learning-goals/study-time', {
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

  const handleSaveTaskQuotas = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      tasks_per_day: tasksPerDay,
      tasks_per_week: tasksPerWeek,
      task_type_values: taskTypeValues, //transformTaskTypeKeys(taskTypeValues),
    };

    try {
      const res = await fetch('/api/settings/learning-goals/task-quotas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({
        title: "Settings saved",
        description: "Your task quotas were saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your task quotas.",
        variant: "destructive",
      });
    }
  };

  const handleSaveQuizGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      daily_quiz_goal: dailyQuizStreakGoal,
      quizzes_per_week: quizzesPerWeek,
      minimum_passing_score: minPassingScore,
      review_missed_topics_weekly: reviewMissedQuizTopicsWeekly,
    };

    try {
      const res = await fetch('/api/settings/learning-goals/quiz-goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({
        title: "Settings saved",
        description: "Your quiz goals were saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your quiz goals.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDifficultyTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      difficulty_range: difficultyRange,
      difficulty_bias: difficultyBias,
      min_tasks_per_level: minTasksPerLevel,
      target_category_distribution: targetCategoryDistribution,
      enforce_balance: enforceBalance,
      min_subcategories_per_category: minSubcategoriesPerCategory,
      auto_alert_on_imbalance: autoAlertOnImbalance,
    };

    try {
      const res = await fetch('/api/settings/learning-goals/difficulty-targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({
        title: "Settings saved",
        description: "Your difficulty targets were saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your difficulty targets.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategoryBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      target_category_distribution: targetCategoryDistribution,
      enforce_balance: enforceBalance,  
      min_subcategories_per_category: minSubcategoriesPerCategory,
      auto_alert_on_imbalance: autoAlertOnImbalance,
      min_completion: minCompletion,
    };

    try {
      const res = await fetch('/api/settings/learning-goals/category-balance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({
        title: "Settings saved",
        description: "Your category balance settings were saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: "There was an error saving your category balance settings.",
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
        {loadingStudyTime ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : (
          <form className="space-y-6 max-w-xl" onSubmit={handleSaveStudyTime}>
            <div>
              <Label htmlFor="daily-goal" className="block text-sm font-medium mb-1">Daily Study Time Goal (hours)</Label>
              <Input
                id="daily-goal"
                type="number"
                min={0}
                step={1}
                placeholder="5"
                value={dailyGoal}
                onChange={e => setDailyGoal(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">5 hours/day</span> — Micro-targets to help with consistency</p>
            </div>
            <div>
              <Label htmlFor="weekly-goal" className="block text-sm font-medium mb-1">Weekly Study Time Goal (hours)</Label>
              <Input
                id="weekly-goal"
                type="number"
                min={0}
                step={0.5}
                placeholder="10"
                value={weeklyGoal}
                onChange={e => setWeeklyGoal(e.target.value === '' ? '' : Number(e.target.value))}
              />
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
              <Input
                id="preferred-hours"
                placeholder="Mornings, 8–10pm"
                value={preferredHours}
                onChange={e => setPreferredHours(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">Mornings</span>, <span className="bg-muted px-1 rounded">8–10pm</span> — Optional, but useful for scheduling & reminders</p>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        )}
      </TabsContent>
      <TabsContent value="task-quotas">
        {loadingTaskQuotas ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : (
          <form className="space-y-6 max-w-xl" onSubmit={handleSaveTaskQuotas}>
            <div>
              <Label htmlFor="tasks-per-day" className="block text-sm font-medium mb-1">Tasks per Day</Label>
              <Input
                id="tasks-per-day"
                type="number"
                min={0}
                step={1}
                placeholder="3"
                value={tasksPerDay}
                onChange={e => setTasksPerDay(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">Example: <span className="bg-muted px-1 rounded">3 tasks/day</span></p>
            </div>
            <div>
              <Label htmlFor="tasks-per-week" className="block text-sm font-medium mb-1">Tasks per Week</Label>
              <Input
                id="tasks-per-week"
                type="number"
                min={0}
                step={1}
                placeholder="15"
                value={tasksPerWeek}
                onChange={e => setTasksPerWeek(e.target.value === '' ? '' : Number(e.target.value))}
              />
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
                      value={taskTypeValues[type.toLowerCase()]}
                      onChange={e => setTaskTypeValues(v => ({ ...v, [type.toLowerCase()]: Number(e.target.value) }))}
                      className="flex-1 accent-primary"
                      id={`task-type-slider-${type}`}
                    />
                    <span className="w-8 text-xs text-muted-foreground text-right">{taskTypeValues[type.toLowerCase()]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Set emphasis for each type: 1 (low) to 10 (high). Example: <span className="bg-muted px-1 rounded">code: 8</span>, <span className="bg-muted px-1 rounded">quiz: 6</span>, <span className="bg-muted px-1 rounded">build: 9</span></p>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        )}
      </TabsContent>
      <TabsContent value="quiz-goals">
        {loadingQuizGoals ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : (
          <form className="space-y-6 max-w-xl" onSubmit={handleSaveQuizGoals}>
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
                <td className="py-2 font-medium">Daily Quiz Streak Goal</td>
                <td><code className="bg-muted px-2 py-1 rounded">boolean</code> <span className="text-xs text-muted-foreground">or</span> <code className="bg-muted px-2 py-1 rounded">number</code></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={0} className="w-20" placeholder="1" value={dailyQuizStreakGoal} onChange={e => setDailyQuizStreakGoal(e.target.value === '' ? '' : Number(e.target.value))} />
                    <span className="text-xs text-muted-foreground">quiz/day</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Quizzes per Week</td>
                <td><code className="bg-muted px-2 py-1 rounded">number</code></td>
                <td><Input type="number" min={0} className="w-32" placeholder="3" value={quizzesPerWeek} onChange={e => setQuizzesPerWeek(e.target.value === '' ? '' : Number(e.target.value))} /></td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Minimum Passing Score</td>
                <td><code className="bg-muted px-2 py-1 rounded">number (%)</code></td>
                <td><Input type="number" min={0} max={100} className="w-32" placeholder="80" value={minPassingScore} onChange={e => setMinPassingScore(e.target.value === '' ? '' : Number(e.target.value))} /></td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Review Missed Quiz Topics Weekly</td>
                <td><code className="bg-muted px-2 py-1 rounded">toggle</code></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={reviewMissedQuizTopicsWeekly} onCheckedChange={checked => setReviewMissedQuizTopicsWeekly(!!checked)} />
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
        )}
      </TabsContent>
      <TabsContent value="difficulty-targets">
        <form className="space-y-6 max-w-xl p-6" onSubmit={handleSaveDifficultyTargets}>
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
        <form className="space-y-6 max-w-xl p-6" onSubmit={handleSaveCategoryBalance}>
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
          <div>
              <Label htmlFor="min-completion" className="block text-sm font-medium mb-1">Minimum Completion % per Category</Label>
              <Input
                id="min-completion"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="10"
                value={minCompletion}
                onChange={e => setMinCompletion(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">e.g., 10% from each major category per week</p>
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