"use server";

import type { GetTodosParams, Todo } from "@/types/todo";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function getTodos(params?: GetTodosParams) {
  const searchParams = new URLSearchParams();

  if (params?.date) {
    searchParams.set("date", params.date);
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();
  const response = await fetch(
    `${BACKEND_API_URL}/todos${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json() as Promise<Todo[]>;
}

export async function getTodo(todoId: number) {
  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo를 불러오지 못했습니다.");
  }

  return response.json() as Promise<Todo>;
}
