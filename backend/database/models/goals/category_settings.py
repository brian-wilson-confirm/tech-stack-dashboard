from sqlmodel import SQLModel, Field
from typing import Optional

class CategorySettings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    enforce_balance: bool = False
    auto_alert_on_imbalance: bool = False
