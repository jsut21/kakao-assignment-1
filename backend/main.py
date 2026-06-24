from datetime import date as DateType
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, status as http_status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from sqlalchemy import Date, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env.local")


def get_required_env(name: str) -> str:
    value = os.getenv(name)
    if value is None or not value.strip():
        raise RuntimeError(f"{name} environment variable is required")
    return value.strip()


def get_env_list(name: str) -> list[str]:
    value = os.getenv(name, "")
    return [item.strip() for item in value.split(",") if item.strip()]


# DB 설정
DATABASE_URL = get_required_env("DATABASE_URL")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


TodoStatus = Literal["active", "completed"]


# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[DateType] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")


# 테이블 생성
Base.metadata.create_all(bind=engine)


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    title: str
    date: DateType
    status: TodoStatus = "active"

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title must not be empty")
        return value.strip()


class TodoUpdate(BaseModel):
    title: str
    date: DateType
    status: TodoStatus

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title must not be empty")
        return value.strip()


class TodoResponse(BaseModel):
    id: int
    title: str
    date: DateType
    status: TodoStatus

    model_config = {"from_attributes": True}


# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_env_list("CORS_ALLOWED_ORIGINS"),
    allow_origin_regex=os.getenv("CORS_ALLOW_ORIGIN_REGEX"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_todo_or_404(todo_id: int, db: Session) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )
    return todo


# 엔드포인트 구현
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    todo_date: DateType | None = Query(default=None, alias="date"),
    todo_status: TodoStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    stmt = select(Todo).order_by(Todo.date.asc(), Todo.id.asc())

    if todo_date is not None:
        stmt = stmt.where(Todo.date == todo_date)

    if todo_status is not None:
        stmt = stmt.where(Todo.status == todo_status)

    return db.scalars(stmt).all()


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    return get_todo_or_404(todo_id, db)


@app.post(
    "/todos",
    response_model=TodoResponse,
    status_code=http_status.HTTP_201_CREATED,
)
def create_todo(todo_create: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(**todo_create.model_dump())

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
):
    todo = get_todo_or_404(todo_id, db)

    todo.title = todo_update.title
    todo.date = todo_update.date
    todo.status = todo_update.status

    db.commit()
    db.refresh(todo)

    return todo


@app.delete("/todos/{todo_id}", status_code=http_status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = get_todo_or_404(todo_id, db)

    db.delete(todo)
    db.commit()
