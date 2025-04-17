import { z } from "zod"

/*******************
  TASK
*******************/
export const taskSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  task: z.string().min(1, "Task name is required"),
  technology: z.string(),
  subcategory: z.string(),
  category: z.string(),
  topics: z.array(z.string()),
  section: z.string(),
  source: z.string(),
  level: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  progress: z.number().min(0).max(100),
  order: z.number(),
  estimated_duration: z.number(),
  actual_duration: z.number(),
  due_date: z.date(),
  start_date: z.date(),
  end_date: z.date(),
  done: z.boolean(),
})

export type Task = z.infer<typeof taskSchema> 

/*******************
  TASK FORM SCHEMA  
*******************/
export const taskFormSchema = z.object({
  task: z.string().min(1, "Task name is required"),
  description: z.string(),
  technology: z.string().min(1, "Technology is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  category: z.string().min(1, "Category is required"),
  order: z.number().min(0),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
  progress: z.number().min(0).max(100),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  type: z.string().min(1, "Type is required"),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  section: z.string(),
  topics: z.array(z.string()),
  source: z.string().min(1, "Source is required"),
  estimated_duration: z.number().min(0),
  actual_duration: z.number().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
})

export type TaskForm = z.infer<typeof taskFormSchema>


/*******************
  TECHNOLOGY
*******************/
export const technologySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export type Technology = z.infer<typeof technologySchema> 


/*******************
  TECHNOLOGY SUBCATEGORY CATEGORY
*******************/
export const techSubCategorySchema = z.object({
  id: z.string(),
  technology: z.string(),
  subcategory: z.string(),
  category: z.string(),
  description: z.string(),
})

export type TechSubCat = z.infer<typeof techSubCategorySchema> 