"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import type { Todo, TodoStatus } from "@/types/todo";

type TodoFormProps = {
  mode: "create" | "edit";
  defaultDate?: string;
  initialTodo?: Todo;
};

function getTodayDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

async function requestTodoApi(path: string, init: RequestInit) {
  const response = await fetch(path, init);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body && typeof body.detail === "string" ? body.detail : null;
    throw new Error(detail ?? "요청을 처리하지 못했습니다.");
  }
}

export default function TodoForm({
  mode,
  defaultDate,
  initialTodo,
}: TodoFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTodo?.title ?? "");
  const [date, setDate] = useState(
    initialTodo?.date ?? defaultDate ?? getTodayDate(),
  );
  const [status, setStatus] = useState<TodoStatus>(
    initialTodo?.status ?? "active",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { title, date, status };

      if (mode === "create") {
        await requestTodoApi("/api/todos", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else if (initialTodo) {
        await requestTodoApi(`/api/todos/${initialTodo.id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      router.push(`/todos?date=${date}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "요청을 처리하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="sr-only" htmlFor="todoInput">
          할 일 입력
        </label>
        <input
          id="todoInput"
          className="min-h-12 w-full rounded-lg border border-[#e7e1f2] bg-white px-4 text-[#1f1f29] outline-none transition focus:border-[#672be0] focus:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
          type="text"
          placeholder="오늘 할 일을 입력하세요"
          autoComplete="off"
          value={title}
          maxLength={255}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
        <label className="grid gap-2 text-sm font-bold text-[#747080]">
          날짜
          <input
            className="min-h-12 w-full rounded-lg border border-[#e7e1f2] bg-white px-4 text-[#1f1f29] outline-none transition focus:border-[#672be0] focus:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#747080]">
          상태
          <select
            className="min-h-12 w-full rounded-lg border border-[#e7e1f2] bg-white px-4 text-[#1f1f29] outline-none transition focus:border-[#672be0] focus:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
            value={status}
            onChange={(event) => setStatus(event.target.value as TodoStatus)}
          >
            <option value="active">진행 중</option>
            <option value="completed">완료</option>
          </select>
        </label>
      </div>

      <p className="my-0 min-h-5 text-sm text-[#d83a52]" role="status" aria-live="polite">
        {errorMessage}
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-2.5 max-[560px]:grid-cols-1">
        <Link
          href={`/todos?date=${date}`}
          className="flex min-h-12 items-center justify-center rounded-lg bg-[#f0edf7] px-5 font-bold text-[#1f1f29] transition hover:bg-[#e4dcf4]"
        >
          취소
        </Link>
        <button
          className="min-h-12 rounded-lg bg-[#672be0] px-5 font-bold text-white transition hover:bg-[#4f1fb0] active:translate-y-px disabled:opacity-60 max-[560px]:w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중" : mode === "create" ? "추가" : "저장"}
        </button>
      </div>
    </form>
  );
}
