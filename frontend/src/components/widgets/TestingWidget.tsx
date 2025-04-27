import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const RESOURCE_TYPES = [
  "article",
  "blog",
  "documentation",
  "video",
  "webinar",
  "repository",
  "tutorial",
  "research paper",
  "course",
  "quiz"
];

export function TestingWidget() {
  const [lessonId, setLessonId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
            lesson_id: lessonId,
            lesson_title: lessonTitle,
            resource_type: resourceType,
          }).toString();

      const response = await fetch(`/api/tasks/from-lesson?${params}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to create task from lesson");
      toast({
        title: "Success",
        description: "Task created from lesson!",
        duration: 3000,
        variant: "default"
      });
      setLessonId("");
      setLessonTitle("");
      setResourceType("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create task from lesson.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Testing Widget</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-md font-bold mb-2">Create a Task from a Lesson</p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="number"
              placeholder="Lesson ID"
              value={lessonId}
              onChange={e => setLessonId(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Lesson Title"
              value={lessonTitle}
              onChange={e => setLessonTitle(e.target.value)}
              required
            />
            <Select value={resourceType} onValueChange={setResourceType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Resource Type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Task"}
            </Button>
          </form>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-muted-foreground">Countries</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-bold">45</p>
          <p className="text-sm text-muted-foreground">Flight Hours</p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-2xl font-bold">$12.5k</p>
          <p className="text-sm text-muted-foreground">Budget Used</p>
        </div>
      </div>
    </div>
  );
} 