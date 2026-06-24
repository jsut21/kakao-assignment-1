# Kakao Tech Campus Assignment 3

Next.js App Router와 FastAPI를 사용해 구현한 Todo CRUD 과제입니다.
프론트엔드는 Server Component와 Client Component를 역할에 맞게 분리했고, 백엔드는 FastAPI CRUD API를 제공합니다.

## 기술 스택

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic v2

## 주요 기능

- Todo 목록 조회
- 날짜별 Todo 조회
- Todo 생성
- Todo 수정 페이지 이동 후 수정
- Todo 완료/취소 상태 변경
- Todo 삭제
- 로딩 화면 처리
- 에러 화면 처리
- 프론트엔드와 백엔드 환경변수 분리

## 프로젝트 구조

```text
.
├── backend
│   ├── main.py
│   └── requirements.txt
└── frontend
    ├── app
    │   ├── actions.ts
    │   ├── api
    │   │   └── todos
    │   │       ├── route.ts
    │   │       └── [todoId]
    │   │           └── route.ts
    │   └── todos
    │       ├── page.tsx
    │       ├── new
    │       │   └── page.tsx
    │       ├── [todoId]
    │       │   └── page.tsx
    │       ├── error.tsx
    │       ├── loading.tsx
    │       └── _components
    │           ├── DateNavigator.tsx
    │           ├── TodoActions.tsx
    │           ├── TodoForm.tsx
    │           ├── TodoItem.tsx
    │           └── TodoList.tsx
    └── types
        └── todo.ts
```

## 실행 방법

### 1. 백엔드 실행

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

## 환경변수

환경변수는 프론트엔드와 백엔드에서 각각 `.env.local`로 분리해서 관리합니다.

## API 명세

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/todos` | Todo 목록 조회 |
| GET | `/todos?date=YYYY-MM-DD` | 특정 날짜 Todo 조회 |
| GET | `/todos/{todo_id}` | Todo 단건 조회 |
| POST | `/todos` | Todo 생성 |
| PUT | `/todos/{todo_id}` | Todo 전체 수정 |
| DELETE | `/todos/{todo_id}` | Todo 삭제 |


## Server Component와 Client Component 분리

페이지 컴포넌트는 기본적으로 Server Component로 구현했습니다.

- `app/todos/page.tsx`: Todo 목록 데이터를 서버에서 조회하고 렌더링
- `app/todos/new/page.tsx`: Todo 생성 페이지 레이아웃 렌더링
- `app/todos/[todoId]/page.tsx`: Todo 단건 데이터를 서버에서 조회하고 수정 폼에 전달
- `app/todos/loading.tsx`: 데이터 로딩 중 화면

브라우저 이벤트와 상태 관리가 필요한 부분만 Client Component로 분리했습니다.

- `TodoForm.tsx`: 입력값 상태 관리, 생성/수정 submit 처리, 페이지 이동 처리
- `TodoActions.tsx`: 완료/취소 버튼, 삭제 버튼, confirm 처리
- `app/todos/error.tsx`: Next.js 에러 바운더리
