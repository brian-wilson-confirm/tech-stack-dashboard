from pydantic import BaseModel
from typing import List
from enum import Enum

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