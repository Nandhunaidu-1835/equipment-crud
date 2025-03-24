# schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class EquipmentOOS(str, Enum):  
    YES = "yes"
    NO = "no"

class EquipmentBase(BaseModel):
    code: str
    description: str
    equipment_type_group_id: int
    equipment_type_id: int
    site: int
    serial_number: Optional[str] = None
    model_number: Optional[str] = None
    qrcode: Optional[str] = None
    asset_number: Optional[str] = None
    status: bool
    installation_date: Optional[datetime] = None
    warranty_start_date: Optional[datetime] = None
    warranty_end_date: Optional[datetime] = None
    out_of_service_flag: Optional[bool] = None
    priority: int
    response_time: int
    work_completion_time: int
    location_1: Optional[int] = None
    location_2: Optional[int] = None
    location_3: Optional[int] = None
    location_4: Optional[str] = None
    equipment_oos: EquipmentOOS  # ✅ Updated to Enum
    sitestartup_account_id: Optional[int] = None
    rotatable: bool = False
    updated_by: int
    updated_datetime: datetime
    defectflag: int = 0

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(EquipmentBase):
    pass

class EquipmentOut(EquipmentBase):
    id: int

    class Config:
        from_attributes = True