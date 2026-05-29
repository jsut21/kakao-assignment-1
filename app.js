const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const messageText = document.querySelector("#messageText");
const todoList = document.querySelector("#todoList");
const previousDateButton = document.querySelector("#previousDateButton");
const selectedDateText = document.querySelector("#selectedDateText");
const nextDateButton = document.querySelector("#nextDateButton");
const filterTabs = document.querySelectorAll(".filter-tab");
const TODO_STORAGE_KEY = "dailyTodoItems";

let todos = [];
let currentFilter = "all";
let selectedDate = new Date();

///////////////////////////////
// 로깅
///////////////////////////////

// 안내 메시지를 한 곳에서 관리해 중복 표시 로직을 줄입니다.
function showMessage(message) {
  messageText.textContent = message;
}

///////////////////////////////////////
// 날짜 관리
///////////////////////////////////////

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

// 화면 상단의 날짜 표시를 현재 선택된 날짜로 갱신합니다.
function updateSelectedDateText() {
  selectedDateText.textContent = getDateDisplayText(selectedDate);
}

// 이전/다음 버튼 클릭 시 선택 날짜를 이동하고 해당 날짜의 Todo만 다시 보여줍니다.
function moveSelectedDate(dayAmount) {
  selectedDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate() + dayAmount
  );

  updateSelectedDateText();
  showMessage("");
  renderTodos();
}

///////////////////////////////////////
// 로컬스토리지
///////////////////////////////////////

// Todo 배열을 JSON 문자열로 변환해 로컬스토리지에 저장합니다.
function saveTodosToLocalStorage() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에 저장된 JSON 문자열을 Todo 배열로 복원합니다.
function loadTodosFromLocalStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (!savedTodos) {
    return;
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (Array.isArray(parsedTodos)) {
      todos = parsedTodos;
    }
  } catch (error) {
    showMessage("저장된 Todo 데이터를 불러오지 못했습니다.");
  }
}

///////////////////////////////////////
// 렌더링
///////////////////////////////////////

// 현재 필터가 적용된 todos 배열을 기준으로 화면 목록을 다시 그립니다.
function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    if (todo.isCompleted) {
      todoItem.classList.add("completed");
    }

    const todoText = document.createElement("p");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const actionArea = document.createElement("div");
    actionArea.className = "todo-actions";

    const editButton = document.createElement("button");
    editButton.className = "todo-action-button edit-button";
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => editTodo(todo.id));

    const completeButton = document.createElement("button");
    completeButton.className = "todo-action-button complete-button";
    completeButton.type = "button";
    completeButton.textContent = todo.isCompleted ? "취소" : "완료";
    completeButton.addEventListener("click", () => toggleTodoCompletion(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-action-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    actionArea.append(editButton, completeButton, deleteButton);
    todoItem.append(todoText, actionArea);
    todoList.append(todoItem);
  });
}

////////////////////////////////////////////
// CRUD
////////////////////////////////////////////

// 새 Todo 객체를 만들고 목록 맨 뒤에 추가합니다.
function addTodo(todoText) {
  const newTodo = {
    id: Date.now(),
    text: todoText,
    isCompleted: false,
    date: getDateKey(selectedDate),
  };

  todos.push(newTodo);
  saveTodosToLocalStorage();
  renderTodos();
}

// 폼 제출 시 빈 값이면 안내하고, 값이 있으면 Todo를 생성합니다.
function safeAddTodo(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (!todoText) {
    showMessage("할 일을 입력해주세요.");
    todoInput.focus();
    return;
  }

  addTodo(todoText);
  todoInput.value = "";
  showMessage("");
  todoInput.focus();
}

// prompt로 새 내용을 입력받아 해당 Todo의 텍스트를 수정합니다.
function editTodo(todoId) {
  const selectedTodo = todos.find((todo) => todo.id === todoId);

  if (!selectedTodo) {
    return;
  }

  const editedText = prompt("수정할 내용을 입력하세요.", selectedTodo.text);

  if (editedText === null) {
    return;
  }

  const trimmedEditedText = editedText.trim();

  if (!trimmedEditedText) {
    showMessage("수정할 내용을 입력해주세요.");
    return;
  }

  selectedTodo.text = trimmedEditedText;
  saveTodosToLocalStorage();
  showMessage("");
  renderTodos();
}

// 완료 상태를 반대로 바꿔 취소선 표시 여부를 제어합니다.
function toggleTodoCompletion(todoId) {
  todos = todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }

    return {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
  });

  saveTodosToLocalStorage();
  showMessage("");
  renderTodos();
}

// 선택한 Todo를 배열에서 제거한 뒤 화면을 갱신합니다.
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodosToLocalStorage();
  showMessage("");
  renderTodos();
}

//////////////////////////////////////////
// filter util
//////////////////////////////////////////

// 선택된 날짜와 현재 상태 필터에 맞는 Todo만 반환합니다.
function getFilteredTodos() {
  const selectedDateKey = getDateKey(selectedDate);
  const todosBySelectedDate = todos.filter((todo) => todo.date === selectedDateKey);

  if (currentFilter === "active") {
    return todosBySelectedDate.filter((todo) => !todo.isCompleted);
  }

  if (currentFilter === "completed") {
    return todosBySelectedDate.filter((todo) => todo.isCompleted);
  }

  return todosBySelectedDate;
}

// 선택된 필터 탭을 시각적으로 구분하고 접근성 상태도 함께 갱신합니다.
function updateFilterTabStyles() {
  filterTabs.forEach((filterTab) => {
    const isSelected = filterTab.dataset.filter === currentFilter;

    filterTab.classList.toggle("active", isSelected);
    filterTab.setAttribute("aria-selected", String(isSelected));
  });
}

// 필터 탭 클릭 시 현재 필터를 바꾸고 목록을 다시 그립니다.
function handleFilterTabClick(event) {
  currentFilter = event.currentTarget.dataset.filter;
  updateFilterTabStyles();
  renderTodos();
}

///////////////////////////
// init
///////////////////////////

loadTodosFromLocalStorage();
updateSelectedDateText();
renderTodos();

previousDateButton.addEventListener("click", () => moveSelectedDate(-1));
nextDateButton.addEventListener("click", () => moveSelectedDate(1));
todoForm.addEventListener("submit", safeAddTodo);
filterTabs.forEach((filterTab) => {
  filterTab.addEventListener("click", handleFilterTabClick);
});
