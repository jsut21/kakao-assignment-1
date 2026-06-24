import type { Todo } from "@/types/todo";
import TodoActions from "./TodoActions";

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  const isCompleted = todo.status === "completed";

  return (
    <li
      className={`grid grid-cols-[1fr_auto] items-center gap-3.5 rounded-lg border border-[#e7e1f2] bg-white p-4 max-[560px]:grid-cols-1 ${
        isCompleted ? "text-[#747080]" : "text-[#1f1f29]"
      }`}
    >
      <p
        className={`m-0 [overflow-wrap:anywhere] leading-normal ${
          isCompleted ? "line-through" : ""
        }`}
      >
        {todo.title}
      </p>
      <TodoActions todo={todo} />
    </li>
  );
}
