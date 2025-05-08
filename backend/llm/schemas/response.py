from dataclasses import dataclass
from typing import Optional, List


@dataclass
class ResourceResponse:
    resource_title: str
    resource_description: str
    resource_type: str
    resource_url: str
    source_name: str
    source_type: str
    source_url: str
    publication_name: Optional[str] = None
    resource_image_url: Optional[str] = None
    resource_authors: Optional[List[str]] = None
    source_image_url: Optional[str] = None


@dataclass
class LessonResponse:
    lesson_title: str
    lesson_description: str
    estimated_duration: str
    level: str
    categories: List[str]
    technologies: List[str]
    topics: Optional[List[str]] = None


@dataclass
class TaskResponse:
    task_name: str
    task_description: str
    task_type: str
    task_status: str
    task_priority: str
