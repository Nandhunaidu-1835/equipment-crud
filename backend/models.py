from sqlalchemy import Column, BigInteger, String, Text, Boolean, DateTime, Integer, CHAR
from sqlalchemy.dialects.postgresql import TIMESTAMP
from database import Base

class Equipment(Base):
    __tablename__ = 'equipment'

    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    equipment_type_group_id = Column(BigInteger, nullable=False)
    equipment_type_id = Column(BigInteger, nullable=False)
    site = Column(BigInteger, nullable=False)
    serial_number = Column(String(100))
    model_number = Column(String(100))
    qrcode = Column(CHAR(36))
    asset_number = Column(String(100))
    status = Column(Boolean, nullable=False)
    installation_date = Column(TIMESTAMP)
    warranty_start_date = Column(TIMESTAMP)
    warranty_end_date = Column(TIMESTAMP)
    out_of_service_flag = Column(Boolean)
    priority = Column(BigInteger, nullable=False)
    response_time = Column(BigInteger, nullable=False)
    work_completion_time = Column(BigInteger, nullable=False)
    location_1 = Column(BigInteger)
    location_2 = Column(BigInteger)
    location_3 = Column(BigInteger)
    location_4 = Column(Text)
    equipment_oos = Column(Text)
    sitestartup_account_id = Column(BigInteger)
    rotatable = Column(Boolean, default=False, nullable=False)
    updated_by = Column(BigInteger, nullable=False)
    updated_datetime = Column(TIMESTAMP, nullable=False)
    defectflag = Column(Integer, default=0, nullable=False)


class AccessLog(Base):
    __tablename__ = 'access_log'

    id = Column(BigInteger, primary_key=True, index=True)
    resource_path = Column(String(250), nullable=False)
    access_timestamp = Column(TIMESTAMP, nullable=False)
    user_id = Column(BigInteger, nullable=False)
    ip_address = Column(String(45), nullable=False)
    browser_info = Column(String(250), nullable=False)
    platform_info = Column(String(250), nullable=False)
    request_method = Column(String(10))
    status_code = Column(Integer)
    response_time_ms = Column(Integer)
    session_id = Column(String(100))
    request_params = Column(Text)
    user_agent = Column(Text)
    
    
class Config:
    from_attributes = True