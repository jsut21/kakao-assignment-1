import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: TodoListProps) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0" aria-label="Todo 목록">
      {todos.length === 0 ? (
        <li className="rounded-lg border border-[#e7e1f2] bg-white p-4 text-center text-sm font-bold text-[#747080]">
          등록된 할 일이 없습니다.
        </li>
      ) : (
        todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </ul>
  );
}
