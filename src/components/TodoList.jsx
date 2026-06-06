import TodoItem from "./TodoItem.jsx";

function TodoList({ todos, onShowMessage, onUpdateTodo, onToggleTodo, onDeleteTodo }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0" aria-label="Todo 목록">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onShowMessage={onShowMessage}
          onUpdateTodo={onUpdateTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
