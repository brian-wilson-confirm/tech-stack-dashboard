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
            "total": 18,
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
            "Kubernetes v1.28 rollout",
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