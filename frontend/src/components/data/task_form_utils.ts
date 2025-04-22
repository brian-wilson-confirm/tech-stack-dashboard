import { TaskForm, TaskFormSubmit } from "./schema";

// Types for dropdown options
export type Option = { id: string; name: string };

export type TaskFormOptionMap = {
  technologyOptions: Option[];
  subcategoryOptions: Option[];
  categoryOptions: Option[];
  typeOptions: Option[];
  levelOptions: Option[];
  statusOptions: Option[];
  priorityOptions: Option[];
  sourceOptions: Option[];
};

export function convertTaskFormToSubmit(
  form: TaskForm,
  {
    technologyOptions,
    subcategoryOptions,
    categoryOptions,
    typeOptions,
    levelOptions,
    statusOptions,
    priorityOptions,
    sourceOptions,
  }: TaskFormOptionMap
): TaskFormSubmit {
  return {
    task: form.task,
    description: form.description,
    technology_id: technologyOptions.find(o => o.name === form.technology)?.id ?? "",
    subcategory_id: subcategoryOptions.find(o => o.name === form.subcategory)?.id ?? "",
    category_id: categoryOptions.find(o => o.name === form.category)?.id ?? "",
    type_id: typeOptions.find(o => o.name === form.type)?.id ?? "",
    level_id: levelOptions.find(o => o.name === form.level)?.id ?? "",
    status_id: statusOptions.find(o => o.name === form.status)?.id ?? "",
    priority_id: priorityOptions.find(o => o.name === form.priority)?.id ?? "",
    source_id: sourceOptions.find(o => o.name === form.source)?.id ?? "",
    topics: form.topics,
    section: form.section,
    order: form.order,
    progress: form.progress,
    estimated_duration: form.estimated_duration,
    actual_duration: form.actual_duration,
    due_date: form.due_date,
    start_date: form.start_date,
    end_date: form.end_date,
  };
}