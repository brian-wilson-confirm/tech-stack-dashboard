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