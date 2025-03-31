from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from enum import Enum
from typing import List, Optional
from datetime import datetime, date

router = APIRouter()

class TechStatus(str, Enum):
    PRODUCTION = "production"
    TESTING = "testing"
    PLANNED = "planned"

class TechStats(BaseModel):
    total: int
    production: int
    testing: int
    planned: int

class TechStackResponse(BaseModel):
    stats: TechStats
    updates: List[str]

class AlertLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class SecurityAlert(BaseModel):
    level: AlertLevel
    message: str

class SecurityResponse(BaseModel):
    alerts: List[SecurityAlert]

class MetricTrend(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"

class Metric(BaseModel):
    name: str
    value: str
    trend: MetricTrend

class MetricsResponse(BaseModel):
    data: List[Metric]

class CoverageItem(BaseModel):
    category: str
    percentage: int

class CoverageResponse(BaseModel):
    items: List[CoverageItem]
    overallProgress: int

class TaskStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TaskType(str, Enum):
    LEARNING = "learning"
    IMPLEMENTATION = "implementation"
    RESEARCH = "research"
    DOCUMENTATION = "documentation"
    MAINTENANCE = "maintenance"

class TaskLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class Task(BaseModel):
    id: str
    done: bool
    task: str
    technology: str
    subcategory: str
    category: str
    section: str
    estimated_duration: int  # in hours
    topics: List[str]
    level: TaskLevel
    type: TaskType
    priority: TaskPriority
    order: int
    status: TaskStatus
    progress: int  # percentage
    source: str
    start_date: Optional[date]
    end_date: Optional[date]
    actual_duration: Optional[int]  # in hours
    # due_date

class TasksResponse(BaseModel):
    tasks: List[Task]

@router.get("/tech/languages", response_model=TechStackResponse)
async def get_languages_stats():
    return {
        "stats": {
            "total": 24,
            "production": 14,
            "testing": 6,
            "planned": 4
        },
        "updates": [
            "Python updated to v3.12",
            "TypeScript v5.3 deployed",
            "React v18.2 in production"
        ]
    }

@router.get("/tech/backend", response_model=TechStackResponse)
async def get_backend_stats():
    return {
        "stats": {
            "total": 666,
            "production": 12,
            "testing": 4,
            "planned": 2
        },
        "updates": [
            "Node.js v20 LTS deployed",
            "Django REST framework updated",
            "GraphQL Gateway testing"
        ]
    }

@router.get("/tech/storage", response_model=TechStackResponse)
async def get_storage_stats():
    return {
        "stats": {
            "total": 15,
            "production": 8,
            "testing": 4,
            "planned": 3
        },
        "updates": [
            "PostgreSQL 16 migration complete",
            "Redis Cache layer expanded",
            "MongoDB Atlas evaluation"
        ]
    }

@router.get("/tech/devops", response_model=TechStackResponse)
async def get_devops_stats():
    return {
        "stats": {
            "total": 20,
            "production": 11,
            "testing": 5,
            "planned": 4
        },
        "updates": [
            "Kubernetes v1.30 rollout",
            "Terraform modules updated",
            "New CI/CD pipeline active"
        ]
    }

@router.get("/security/alerts", response_model=SecurityResponse)
async def get_security_alerts():
    return {
        "alerts": [
            {
                "level": AlertLevel.HIGH,
                "message": "Dependencies security audit needed"
            },
            {
                "level": AlertLevel.MEDIUM,
                "message": "JWT token expiration review"
            },
            {
                "level": AlertLevel.LOW,
                "message": "SSL certificate renewal in 30 days"
            }
        ]
    }

@router.get("/metrics", response_model=MetricsResponse)
async def get_system_metrics():
    return {
        "data": [
            {
                "name": "System Uptime",
                "value": "99.98%",
                "trend": MetricTrend.UP
            },
            {
                "name": "API Response Time",
                "value": "245ms",
                "trend": MetricTrend.STABLE
            },
            {
                "name": "Error Rate",
                "value": "0.02%",
                "trend": MetricTrend.DOWN
            }
        ]
    }

@router.get("/coverage", response_model=CoverageResponse)
async def get_coverage():
    return {
        "items": [
            {"category": "Frontend", "percentage": 70},
            {"category": "Middleware", "percentage": 30},
            {"category": "Backend", "percentage": 60},
            {"category": "Database", "percentage": 50},
            {"category": "Messaging", "percentage": 10},
            {"category": "DevOps", "percentage": 40},
            {"category": "Security", "percentage": 20},
            {"category": "Monitoring", "percentage": 10}
        ],
        "overallProgress": 37
    }

@router.get("/tasks", response_model=TasksResponse)
async def get_tasks():
    return {
        "tasks": [
            {
                "id": "1",
                "done": False,
                "task": "Complete PluralSight course on FastAPI",
                "technology": "FastAPI",
                "subcategory": "API",
                "category": "Backend",
                "section": "Learning Path",
                "estimated_duration": 8,
                "topics": ["REST API", "Python", "API Documentation", "Authentication"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.LEARNING,
                "priority": TaskPriority.HIGH,
                "order": 1,
                "status": TaskStatus.IN_PROGRESS,
                "progress": 60,
                "source": "PluralSight",
                "start_date": "2024-03-01",
                "end_date": "2024-03-15",
                "actual_duration": None
            },
            {
                "id": "2",
                "done": True,
                "task": "Create responsive dashboard layout",
                "technology": "Material-UI",
                "subcategory": "UI Framework",
                "category": "Frontend",
                "section": "Implementation",
                "estimated_duration": 16,
                "topics": ["React", "Responsive Design", "Component Library", "Theming"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 2,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Internal Project",
                "start_date": "2024-02-15",
                "end_date": "2024-02-28",
                "actual_duration": 20
            },
            {
                "id": "3",
                "done": False,
                "task": "Set up CI/CD pipeline with GitHub Actions",
                "technology": "Jenkins",
                "subcategory": "CI/CD",
                "category": "DevOps",
                "section": "Infrastructure",
                "estimated_duration": 24,
                "topics": ["CI/CD", "Automation", "DevOps", "GitHub Actions"],
                "level": TaskLevel.ADVANCED,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.CRITICAL,
                "order": 3,
                "status": TaskStatus.IN_PROGRESS,
                "progress": 30,
                "source": "Team Initiative",
                "start_date": "2024-03-10",
                "end_date": "2024-03-25",
                "actual_duration": None
            },
            {
                "id": "4",
                "done": True,
                "task": "Configure Redis caching layer",
                "technology": "Redis",
                "subcategory": "Caching",
                "category": "Backend",
                "section": "Performance",
                "estimated_duration": 12,
                "topics": ["Caching", "Redis", "Performance Optimization"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.MEDIUM,
                "order": 4,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Architecture Review",
                "start_date": "2024-02-01",
                "end_date": "2024-02-10",
                "actual_duration": 10
            },
            {
                "id": "5",
                "done": False,
                "task": "Write unit tests for API endpoints",
                "technology": "Jest",
                "subcategory": "Testing",
                "category": "Backend",
                "section": "Quality Assurance",
                "estimated_duration": 20,
                "topics": ["Unit Testing", "API Testing", "Test Coverage"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 5,
                "status": TaskStatus.NOT_STARTED,
                "progress": 0,
                "source": "Quality Standards",
                "start_date": None,
                "end_date": None,
                "actual_duration": None
            },
            {
                "id": "6",
                "done": False,
                "task": "Implement OAuth2 authentication",
                "technology": "Auth0",
                "subcategory": "Authentication",
                "category": "Security",
                "section": "Security Implementation",
                "estimated_duration": 30,
                "topics": ["OAuth2", "JWT", "Security Protocols", "User Management"],
                "level": TaskLevel.ADVANCED,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.CRITICAL,
                "order": 6,
                "status": TaskStatus.NOT_STARTED,
                "progress": 0,
                "source": "Security Audit",
                "start_date": "2024-04-01",
                "end_date": "2024-04-15",
                "actual_duration": None
            },
            {
                "id": "7",
                "done": True,
                "task": "Set up Kubernetes cluster",
                "technology": "Kubernetes",
                "subcategory": "Container Orchestration",
                "category": "DevOps",
                "section": "Infrastructure",
                "estimated_duration": 40,
                "topics": ["Kubernetes", "Container Orchestration", "High Availability"],
                "level": TaskLevel.EXPERT,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 7,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Infrastructure Upgrade",
                "start_date": "2024-01-15",
                "end_date": "2024-02-15",
                "actual_duration": 45
            },
            {
                "id": "8",
                "done": False,
                "task": "Configure Elasticsearch logging",
                "technology": "Elasticsearch",
                "subcategory": "Logging",
                "category": "Monitoring",
                "section": "Observability",
                "estimated_duration": 16,
                "topics": ["ELK Stack", "Log Management", "Monitoring"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.MEDIUM,
                "order": 8,
                "status": TaskStatus.ON_HOLD,
                "progress": 25,
                "source": "Monitoring Initiative",
                "start_date": "2024-03-20",
                "end_date": None,
                "actual_duration": None
            },
            {
                "id": "9",
                "done": True,
                "task": "Implement GraphQL API",
                "technology": "Apollo",
                "subcategory": "API",
                "category": "Backend",
                "section": "API Development",
                "estimated_duration": 35,
                "topics": ["GraphQL", "API Design", "Schema Development"],
                "level": TaskLevel.ADVANCED,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 9,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "API Modernization",
                "start_date": "2024-01-01",
                "end_date": "2024-02-01",
                "actual_duration": 32
            },
            {
                "id": "10",
                "done": False,
                "task": "Set up message queue system",
                "technology": "RabbitMQ",
                "subcategory": "Message Queue",
                "category": "Messaging",
                "section": "System Integration",
                "estimated_duration": 25,
                "topics": ["Message Queues", "Async Processing", "System Integration"],
                "level": TaskLevel.ADVANCED,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 10,
                "status": TaskStatus.IN_PROGRESS,
                "progress": 45,
                "source": "Architecture Enhancement",
                "start_date": "2024-03-15",
                "end_date": "2024-04-01",
                "actual_duration": None
            },
            {
                "id": "11",
                "done": True,
                "task": "Implement real-time notifications",
                "technology": "WebSocket",
                "subcategory": "Real-time",
                "category": "Frontend",
                "section": "User Experience",
                "estimated_duration": 20,
                "topics": ["WebSocket", "Real-time Communication", "Push Notifications"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.MEDIUM,
                "order": 11,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "UX Enhancement",
                "start_date": "2024-02-20",
                "end_date": "2024-03-05",
                "actual_duration": 18
            },
            {
                "id": "12",
                "done": False,
                "task": "Configure database replication",
                "technology": "PostgreSQL",
                "subcategory": "Database",
                "category": "Database",
                "section": "Data Management",
                "estimated_duration": 28,
                "topics": ["Database Replication", "High Availability", "Data Consistency"],
                "level": TaskLevel.EXPERT,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.CRITICAL,
                "order": 12,
                "status": TaskStatus.IN_PROGRESS,
                "progress": 70,
                "source": "Database Reliability",
                "start_date": "2024-03-01",
                "end_date": "2024-03-20",
                "actual_duration": None
            },
            {
                "id": "13",
                "done": True,
                "task": "Set up service mesh",
                "technology": "Istio",
                "subcategory": "Service Mesh",
                "category": "DevOps",
                "section": "Infrastructure",
                "estimated_duration": 45,
                "topics": ["Service Mesh", "Microservices", "Traffic Management"],
                "level": TaskLevel.EXPERT,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 13,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Architecture Modernization",
                "start_date": "2024-01-10",
                "end_date": "2024-02-20",
                "actual_duration": 50
            },
            {
                "id": "14",
                "done": False,
                "task": "Implement rate limiting",
                "technology": "Kong",
                "subcategory": "API Gateway",
                "category": "Middleware",
                "section": "API Management",
                "estimated_duration": 15,
                "topics": ["Rate Limiting", "API Gateway", "Traffic Control"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.MEDIUM,
                "order": 14,
                "status": TaskStatus.NOT_STARTED,
                "progress": 0,
                "source": "API Security",
                "start_date": None,
                "end_date": None,
                "actual_duration": None
            },
            {
                "id": "15",
                "done": True,
                "task": "Set up monitoring dashboards",
                "technology": "Grafana",
                "subcategory": "Monitoring",
                "category": "DevOps",
                "section": "Observability",
                "estimated_duration": 18,
                "topics": ["Monitoring", "Metrics", "Dashboards", "Alerting"],
                "level": TaskLevel.INTERMEDIATE,
                "type": TaskType.IMPLEMENTATION,
                "priority": TaskPriority.HIGH,
                "order": 15,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Monitoring Setup",
                "start_date": "2024-02-01",
                "end_date": "2024-02-10",
                "actual_duration": 16
            },
            {
                "id": "16",
                "done": False,
                "task": "Research AI integration options",
                "technology": "TensorFlow",
                "subcategory": "Machine Learning",
                "category": "Research",
                "section": "Innovation",
                "estimated_duration": 40,
                "topics": ["AI", "Machine Learning", "Integration Strategy"],
                "level": TaskLevel.EXPERT,
                "type": TaskType.RESEARCH,
                "priority": TaskPriority.MEDIUM,
                "order": 16,
                "status": TaskStatus.IN_PROGRESS,
                "progress": 35,
                "source": "Innovation Initiative",
                "start_date": "2024-03-01",
                "end_date": "2024-04-15",
                "actual_duration": None
            },
            {
                "id": "17",
                "done": True,
                "task": "Document API versioning strategy",
                "technology": "OpenAPI",
                "subcategory": "Documentation",
                "category": "Backend",
                "section": "Documentation",
                "estimated_duration": 10,
                "topics": ["API Documentation", "Versioning", "Best Practices"],
                "level": TaskLevel.BEGINNER,
                "type": TaskType.DOCUMENTATION,
                "priority": TaskPriority.LOW,
                "order": 17,
                "status": TaskStatus.COMPLETED,
                "progress": 100,
                "source": "Documentation Sprint",
                "start_date": "2024-02-25",
                "end_date": "2024-03-01",
                "actual_duration": 8
            }
        ]
    } 