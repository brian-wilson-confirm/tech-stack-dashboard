import { StatusEnum, PriorityEnum } from "@/types/enums";
import { capitalizeWords } from "@/lib/utils";

export const getStatusColor = (status?: StatusEnum) => {
  if (!status) return "bg-gray-500"; // default/fallback
  const normalized = capitalizeWords(status.replace('_', ' ')) as StatusEnum;
  const colors: Record<StatusEnum, string> = {
    [StatusEnum.not_started]: "bg-gray-500",
    [StatusEnum.in_progress]: "bg-blue-500",
    [StatusEnum.completed]: "bg-green-500",
    [StatusEnum.on_hold]: "bg-yellow-500",
    [StatusEnum.canceled]: "bg-red-500"
  }
  return colors[normalized] || "bg-gray-500"
}
  
export const getPriorityColor = (priority?: PriorityEnum) => {
  if (!priority) return "bg-gray-500"; // default/fallback
  const normalized = capitalizeWords(priority.replace('_', ' ')) as PriorityEnum;
  const colors: Record<PriorityEnum, string> = {
    [PriorityEnum.low]: "bg-gray-500",
    [PriorityEnum.medium]: "bg-blue-500",
    [PriorityEnum.high]: "bg-yellow-500",
    [PriorityEnum.critical]: "bg-red-500"
  }
  return colors[normalized] || "bg-gray-500"
}