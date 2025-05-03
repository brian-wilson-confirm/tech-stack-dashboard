import { StatusEnum, PriorityEnum, LevelEnum } from "@/types/enums";
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

export const getLevelColor = (level?: LevelEnum) => {
  if (!level) return "bg-gray-500"; // default/fallback
  const normalized = capitalizeWords(level.replace('_', ' ')) as LevelEnum;
  const colors: Record<LevelEnum, string> = {
    [LevelEnum.beginner]: "bg-gray-500",
    [LevelEnum.intermediate]: "bg-blue-500",
    [LevelEnum.advanced]: "bg-yellow-500",
    [LevelEnum.expert]: "bg-red-500"
  }
  return colors[normalized] || "bg-gray-500"
}