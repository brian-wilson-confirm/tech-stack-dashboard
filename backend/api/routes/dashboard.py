from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from enum import Enum
from typing import List

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

class Task(BaseModel):
    id: str
    done: bool
    task: str
    technology: str
    subcategory: str
    category: str

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
                "category": "Backend"
            },
            {
                "id": "2",
                "done": True,
                "task": "Create responsive dashboard layout",
                "technology": "Material-UI",
                "subcategory": "UI Framework",
                "category": "Frontend"
            },
            {
                "id": "3",
                "done": False,
                "task": "Set up CI/CD pipeline with GitHub Actions",
                "technology": "Jenkins",
                "subcategory": "CI/CD",
                "category": "DevOps"
            },
            {
                "id": "4",
                "done": True,
                "task": "Configure Redis caching layer",
                "technology": "Redis",
                "subcategory": "Caching",
                "category": "Backend"
            },
            {
                "id": "5",
                "done": False,
                "task": "Write unit tests for API endpoints",
                "technology": "Jest",
                "subcategory": "Testing",
                "category": "Backend"
            },
            {
                "id": "6",
                "done": False,
                "task": "Implement OAuth2 authentication",
                "technology": "Auth0",
                "subcategory": "Authentication",
                "category": "Security"
            },
            {
                "id": "7",
                "done": True,
                "task": "Set up Kubernetes cluster",
                "technology": "Kubernetes",
                "subcategory": "Container Orchestration",
                "category": "DevOps"
            },
            {
                "id": "8",
                "done": False,
                "task": "Configure Elasticsearch logging",
                "technology": "Elasticsearch",
                "subcategory": "Logging",
                "category": "Monitoring"
            },
            {
                "id": "9",
                "done": True,
                "task": "Implement GraphQL API",
                "technology": "Apollo",
                "subcategory": "API",
                "category": "Backend"
            },
            {
                "id": "10",
                "done": False,
                "task": "Set up message queue system",
                "technology": "RabbitMQ",
                "subcategory": "Message Queue",
                "category": "Messaging"
            },
            {
                "id": "11",
                "done": True,
                "task": "Implement real-time notifications",
                "technology": "WebSocket",
                "subcategory": "Real-time",
                "category": "Frontend"
            },
            {
                "id": "12",
                "done": False,
                "task": "Configure database replication",
                "technology": "PostgreSQL",
                "subcategory": "Database",
                "category": "Database"
            },
            {
                "id": "13",
                "done": True,
                "task": "Set up service mesh",
                "technology": "Istio",
                "subcategory": "Service Mesh",
                "category": "DevOps"
            },
            {
                "id": "14",
                "done": False,
                "task": "Implement rate limiting",
                "technology": "Kong",
                "subcategory": "API Gateway",
                "category": "Middleware"
            },
            {
                "id": "15",
                "done": True,
                "task": "Set up monitoring dashboards",
                "technology": "Grafana",
                "subcategory": "Monitoring",
                "category": "DevOps"
            },
            {
                "id": "16",
                "done": False,
                "task": "Implement data caching strategy",
                "technology": "Memcached",
                "subcategory": "Caching",
                "category": "Backend"
            },
            {
                "id": "17",
                "done": True,
                "task": "Configure SSL/TLS certificates",
                "technology": "Let's Encrypt",
                "subcategory": "Security",
                "category": "DevOps"
            }
        ]
    } 