import { z } from "zod"


/*******************
  LESSON SCHEMA
*******************/
export const lessonSchema = z.object({
  id: z.string(),
  lesson_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  level: z.string(),
  module: z.string(),
  course: z.string(),
  content: z.string(),
  video_url: z.string(),
  order: z.number().min(0),
  estimated_duration: z.string()
})
export type Lesson = z.infer<typeof lessonSchema> 


/*******************
  LESSON TABLE SCHEMA
*******************/
export const lessonTableSchema = z.object({
  id: z.string(),
  lesson_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  technologies: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable()
    })
  ),
  subcategories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string().nullable()
    })
  ),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string()
    })
  ),
  topics: z.array(
    z.object({
      id: z.string(),
      name: z.string()
    })
  ),
  level: z.string(),
  module: z.string(),
  course: z.string(),
  content: z.string(),
  video_url: z.string(),
  order: z.number().min(0),
  estimated_duration: z.string()
})
export type LessonTable = z.infer<typeof lessonTableSchema> 



/*******************
  LESSON FORM SCHEMA  
*******************/
export const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  module_id: z.string().nullable(),
  course_id: z.string().nullable(),
  content: z.string().nullable(),
  video_url: z.string().nullable(),
  order: z.number().min(0),
  estimated_duration: z.string()
})
export type LessonForm = z.infer<typeof lessonFormSchema>



/*******************
  TASK OLD BASE
*******************/
export const taskOldBaseSchema = z.object({
  task: z.string().min(1, "Task name is required"),
  description: z.string(),
  topics: z.array(z.string()),
  section: z.string(),
  progress: z.number().min(0).max(100),
  order: z.number().min(0),
  estimated_duration: z.number().min(0),
  actual_duration: z.number().nullable(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable()
})


/*******************
  TASK OLD SCHEMA
*******************/
export const taskOldSchema = taskOldBaseSchema.extend({
  id: z.string(),
  task_id: z.string(),
  technology: z.string(),
  subcategory: z.string(),
  category: z.string(),
  source: z.string(), 
  level: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  done: z.boolean(),
})
export type TaskOld = z.infer<typeof taskOldSchema> 



/*******************
  TASK OLD FORM SCHEMA  
*******************/
export const taskOldFormSchema = taskOldBaseSchema.extend({
  technology_id: z.string().min(1, "Technology is required"),
  subcategory_id: z.string().min(1, "Subcategory is required"),
  category_id: z.string().min(1, "Category is required"),
  source_id: z.string().min(1, "Source is required"),
  level_id: z.string().min(1, "Level is required"),
  type_id: z.string().min(1, "Type is required"),
  status_id: z.string().min(1, "Status is required"),
  priority_id: z.string().min(1, "Priority is required")
})
export type TaskOldForm = z.infer<typeof taskOldFormSchema>



/*******************
  TASK BASE
*******************/
export const taskBaseSchema = z.object({
  task: z.string().min(1, "Task name is required"),
  description: z.string(),
  progress: z.number().min(0).max(100),
  order: z.number().min(0),
  estimated_duration: z.string(),
  actual_duration: z.number().nullable(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable()
})


/*******************
  TASK SCHEMA
*******************/
export const taskSchema = taskBaseSchema.extend({
  id: z.string(),
  task_id: z.string(),
  lesson: lessonTableSchema,
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  done: z.boolean(),
})
export type Task = z.infer<typeof taskSchema> 



/*******************
  TASK FORM SCHEMA  
*******************/
export const taskFormSchema = taskBaseSchema.extend({
  lesson_id: z.string().min(1, "Lesson is required"),
  type_id: z.string().min(1, "Type is required"),
  status_id: z.string().min(1, "Status is required"),
  priority_id: z.string().min(1, "Priority is required")
})
export type TaskForm = z.infer<typeof taskFormSchema>



/*******************
  TECHNOLOGY
*******************/
export const technologySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
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
  description: z.string()
})
export type TechSubCat = z.infer<typeof techSubCategorySchema> 



/*******************
  COURSE SCHEMA
*******************/
export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  level: z.string(),
  resource: z.string(),
})
export type Course = z.infer<typeof courseSchema> 



/*******************
  COURSE FORM SCHEMA  
*******************/
export const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
})
export type CourseForm = z.infer<typeof courseFormSchema>
