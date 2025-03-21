from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, SessionLocal
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup: list your frontend URLs here
origins = [
    "http://localhost:5173",  # React frontend local dev
    "http://127.0.0.1:5173",  # Sometimes it's accessed by IP
    # Add production frontend domain here when ready
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Origins allowed to access
    allow_credentials=True,
    allow_methods=["*"],              # Methods allowed (GET, POST, etc.)
    allow_headers=["*"],              # Headers allowed
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Access log function
def log_access(request: Request, db: Session, status_code: int):
    from models import AccessLog  # We'll create this model next
    log = AccessLog(
        resource_path=request.url.path,
        access_timestamp=datetime.now(timezone.utc),
        user_id=1,  # Replace with real user_id later
        ip_address=request.client.host,
        browser_info="Unknown",
        platform_info="Unknown",
        request_method=request.method,
        status_code=status_code,
        response_time_ms=0,
        session_id="dummy-session",
        request_params=str(dict(request.query_params)),
        user_agent=str(request.headers.get("user-agent"))
    )
    db.add(log)
    db.commit()

@app.post("/equipment/", response_model=schemas.EquipmentOut)
def create_equipment(equipment: schemas.EquipmentCreate, request: Request, db: Session = Depends(get_db)):
    result = crud.create_equipment(db, equipment)
    log_access(request, db, 200)
    return result

@app.get("/equipment/{equipment_id}", response_model=schemas.EquipmentOut)
def read_equipment(equipment_id: int, request: Request, db: Session = Depends(get_db)):
    db_equipment = crud.get_equipment(db, equipment_id)
    if db_equipment is None:
        log_access(request, db, 404)
        raise HTTPException(status_code=404, detail="Equipment not found")
    log_access(request, db, 200)
    return db_equipment

@app.get("/equipment/", response_model=list[schemas.EquipmentOut])
def read_all_equipment(skip: int = 0, limit: int = 10, request: Request = None, db: Session = Depends(get_db)):
    result = crud.get_all_equipment(db, skip=skip, limit=limit)
    log_access(request, db, 200)
    return result

@app.put("/equipment/{equipment_id}", response_model=schemas.EquipmentOut)
def update_equipment(equipment_id: int, equipment: schemas.EquipmentUpdate, request: Request, db: Session = Depends(get_db)):
    result = crud.update_equipment(db, equipment_id, equipment)
    if result is None:
        log_access(request, db, 404)
        raise HTTPException(status_code=404, detail="Equipment not found")
    log_access(request, db, 200)
    return result

@app.delete("/equipment/{equipment_id}")
def delete_equipment(equipment_id: int, request: Request, db: Session = Depends(get_db)):
    result = crud.delete_equipment(db, equipment_id)
    if result is None:
        log_access(request, db, 404)
        raise HTTPException(status_code=404, detail="Equipment not found")
    log_access(request, db, 200)
    return {"detail": "Equipment deleted successfully"}
