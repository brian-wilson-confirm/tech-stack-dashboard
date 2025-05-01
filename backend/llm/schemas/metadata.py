from dataclasses import dataclass
from typing import Optional, List


@dataclass
class ResourceMetadata:
    title: str
    description: str
    url: str
    type: str
    image_url: Optional[str] = None
    authors: Optional[List[str]] = None


@dataclass
class SourceMetadata:
    name: str
    type: str
    website: str
    image_url: Optional[str] = None


@dataclass
class CategoryMetadata:
    category: str
    subcategories: List[str]


@dataclass
class TechnologyMetadata:
    technology: str
    subcategories: List[str]


@dataclass
class LessonMetadata:
    title: str
    description: str
    estimated_duration: str
    level: str
    categories: List[CategoryMetadata]
    technologies: List[TechnologyMetadata]
    content: Optional[str] = None
    topics: Optional[List[str]] = None


@dataclass
class TaskMetadata:
    name: str
    description: str
    type: str
    status: str
    priority: str


@dataclass
class Metadata:
    resource: ResourceMetadata
    source: SourceMetadata
    lesson: LessonMetadata
    task: TaskMetadata
