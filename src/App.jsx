import { useEffect, useMemo, useState } from "react";
import DateNavigator from "./components/DateNavigator.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

const TODO_STORAGE_KEY = "dailyTodoItems";

// 날짜를 Todo 저장과 비교에 사용할 수 있는 YYYY-MM-DD 형식으로 변환합니다.
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 선택된 날짜를 사용자가 읽기 쉬운 한국어 날짜 문구로 표시합니다.
function getDateDisplayText(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

// 로컬스토리지에 저장된 JSON 문자열을 Todo 배열로 복원합니다.
function loadTodosFromLocalStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodosFromLocalStorage);
  const [todoInputText, setTodoInputText] = useState("");
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const selectedDateKey = getDateKey(selectedDate);
  const selectedDateText = getDateDisplayText(selectedDate);

  // Todo가 추가, 수정, 삭제, 완료 처리될 때마다 JSON 문자열로 자동 저장합니다.
  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    const todosBySelectedDate = todos.filter((todo) => todo.date === selectedDateKey);

    if (currentFilter === "active") {
      return todosBySelectedDate.filter((todo) => !todo.isCompleted);
    }

    if (currentFilter === "completed") {
      return todosBySelectedDate.filter((todo) => todo.isCompleted);
    }

    return todosBySelectedDate;
  }, [currentFilter, selectedDateKey, todos]);

  function moveSelectedDate(dayAmount) {
    setSelectedDate((currentDate) =>
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + dayAmount)
    );
    setMessage("");
  }

  function addTodo(event) {
    event.preventDefault();

    const trimmedTodoText = todoInputText.trim();

    if (!trimmedTodoText) {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedTodoText,
      isCompleted: false,
      date: selectedDateKey,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setTodoInputText("");
    setMessage("");
  }

  function updateTodo(todoId, nextTodoText) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, text: nextTodoText } : todo))
    );
    setMessage("");
  }

  function toggleTodoCompletion(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    setMessage("");
  }

  function deleteTodo(todoId) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    setMessage("");
  }

  function changeFilter(nextFilter) {
    setCurrentFilter(nextFilter);
    setMessage("");
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f7f5fb] px-5 py-16 max-[560px]:px-3.5 max-[560px]:py-7" aria-labelledby="appTitle">
      <section className="w-full max-w-2xl rounded-lg border border-[#e7e1f2] bg-white p-9 shadow-[0_20px_45px_rgba(32,20,57,0.12)] max-[560px]:p-6">
        <header className="mb-7">
          <p className="m-0 mb-2 text-sm font-bold uppercase text-brand">Productivity</p>
          <h1 id="appTitle" className="m-0 text-[34px] font-bold leading-tight text-[#1f1f29] max-[560px]:text-[28px]">
            Todo App
          </h1>
        </header>

        <DateNavigator selectedDateText={selectedDateText} onMoveDate={moveSelectedDate} />

        <TodoForm todoInputText={todoInputText} onInputChange={setTodoInputText} onSubmit={addTodo} />

        <p className="my-3 min-h-5 text-sm text-[#d83a52]" role="status" aria-live="polite">
          {message}
        </p>

        <FilterTabs currentFilter={currentFilter} onChangeFilter={changeFilter} />

        <TodoList
          todos={filteredTodos}
          onShowMessage={setMessage}
          onUpdateTodo={updateTodo}
          onToggleTodo={toggleTodoCompletion}
          onDeleteTodo={deleteTodo}
        />
      </section>
    </main>
  );
}

export default App;
