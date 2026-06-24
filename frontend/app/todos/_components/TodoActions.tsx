"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Todo } from "@/types/todo";

type TodoActionsProps = {
  todo: Todo;
};

const baseButtonClass =
  "min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold transition hover:bg-[#e4dcf4] disabled:opacity-60 max-[560px]:w-full";

async function requestTodoApi(path: string, init: RequestInit) {
  const response = await fetch(path, init);

  if (!response.ok) {
    throw new Error("요청을 처리하지 못했습니다.");
  }
}

export default function TodoActions({ todo }: TodoActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleToggleStatus = async () => {
    setIsPending(true);

    try {
      await requestTodoApi(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: todo.title,
          date: todo.date,
          status: todo.status === "completed" ? "active" : "completed",
        }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 할 일을 삭제할까요?")) {
      return;
    }

    setIsPending(true);

    try {
      await requestTodoApi(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex gap-2 max-[560px]:grid max-[560px]:grid-cols-3">
      <Link
        href={`/todos/${todo.id}`}
        className={`${baseButtonClass} flex items-center justify-center text-[#1f1f29]`}
      >
        수정
      </Link>
      <button
        className={`${baseButtonClass} text-[#258a5d]`}
        type="button"
        onClick={handleToggleStatus}
        disabled={isPending}
      >
        {todo.status === "completed" ? "취소" : "완료"}
      </button>
      <button
        className={`${baseButtonClass} text-[#d83a52]`}
        type="button"
        onClick={handleDelete}
        disabled={isPending}
      >
        삭제
      </button>
    </div>
  );
}
