import { date, z } from "zod"

export const taskSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  task: z.string(),
  //technology: z.string(),
  //subcategory: z.string(),
  //category: z.string(),
  //topics: z.array(z.string()),
  //section: z.string(),
  source: z.string(),
  //level: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  //progress: z.number(),
  //order: z.number(),
  start_date: z.date(),
  //end_date: z.date(),
  estimated_duration: z.number(),
  //actual_duration: z.number(),
  //done: z.boolean(),
})

export type Task = z.infer<typeof taskSchema> 