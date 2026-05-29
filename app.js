const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const messageText = document.querySelector("#messageText");
const todoList = document.querySelector("#todoList");

let todos = [];

// 안내 메시지를 한 곳에서 관리해 중복 표시 로직을 줄입니다.
function showMessage(message) {
  messageText.textContent = message;
}

// 입력값 앞뒤 공백을 제거해 실제 내용이 있는 Todo만 생성합니다.
function getTrimmedInputValue() {
  return todoInput.value.trim();
}

// 현재 todos 배열을 기준으로 화면 목록을 다시 그립니다.
function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
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

// 새 Todo 객체를 만들고 목록 맨 뒤에 추가합니다.
function addTodo(todoText) {
  const newTodo = {
    id: Date.now(),
    text: todoText,
    isCompleted: false,
  };

  todos.push(newTodo);
  renderTodos();
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

  showMessage("");
  renderTodos();
}

// 선택한 Todo를 배열에서 제거한 뒤 화면을 갱신합니다.
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  showMessage("");
  renderTodos();
}

// 폼 제출 시 빈 값이면 안내하고, 값이 있으면 Todo를 생성합니다.
function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoText = getTrimmedInputValue();

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

todoForm.addEventListener("submit", handleTodoFormSubmit);
