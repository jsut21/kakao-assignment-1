import Link from "next/link";
import { getTodos } from "@/app/actions";
import type { TodoStatus } from "@/types/todo";
import DateNavigator from "./_components/DateNavigator";
import TodoList from "./_components/TodoList";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<{
    date?: string | string[];
    status?: string | string[];
  }>;
};

const FILTER_OPTIONS: { value: "all" | TodoStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateFromKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDateDisplayText(dateKey: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(getDateFromKey(dateKey));
}

function shiftDateKey(dateKey: string, dayAmount: number) {
  const date = getDateFromKey(dateKey);
  date.setDate(date.getDate() + dayAmount);
  return getDateKey(date);
}

function buildTodosHref(dateKey: string, status?: TodoStatus) {
  const params = new URLSearchParams({ date: dateKey });

  if (status) {
    params.set("status", status);
  }

  return `/todos?${params.toString()}`;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = await searchParams;
  const dateParam = typeof params.date === "string" ? params.date : undefined;
  const statusParam = typeof params.status === "string" ? params.status : undefined;
  const selectedDateKey =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : getDateKey(new Date());
  const status: TodoStatus | undefined =
    statusParam === "active" || statusParam === "completed"
      ? statusParam
      : undefined;
  const selectedFilter = status ?? "all";
  const todos = await getTodos({ date: selectedDateKey, status });
  const newTodoHref = `/todos/new?date=${selectedDateKey}`;

  return (
    <main
      className="flex min-h-screen items-start justify-center bg-[#f7f5fb] px-5 py-16 max-[560px]:px-3.5 max-[560px]:py-7"
      aria-labelledby="appTitle"
    >
      <section className="w-full max-w-2xl rounded-lg border border-[#e7e1f2] bg-white p-9 shadow-[0_20px_45px_rgba(32,20,57,0.12)] max-[560px]:p-6">
        <header className="mb-7">
          <p className="m-0 mb-2 text-sm font-bold uppercase text-[#672be0]">
            Productivity
          </p>
          <h1
            id="appTitle"
            className="m-0 text-[34px] font-bold leading-tight text-[#1f1f29] max-[560px]:text-[28px]"
          >
            Todo App
          </h1>
        </header>

        <DateNavigator
          selectedDateText={getDateDisplayText(selectedDateKey)}
          previousHref={buildTodosHref(shiftDateKey(selectedDateKey, -1), status)}
          nextHref={buildTodosHref(shiftDateKey(selectedDateKey, 1), status)}
        />

        <div className="grid grid-cols-[1fr_auto] gap-2.5 max-[560px]:grid-cols-1">
          <Link
            href={newTodoHref}
            className="flex min-h-12 w-full items-center rounded-lg border border-[#e7e1f2] bg-white px-4 text-[#747080] outline-none transition hover:border-[#672be0] hover:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
          >
            오늘 할 일을 입력하세요
          </Link>
          <Link
            href={newTodoHref}
            className="flex min-h-12 items-center justify-center rounded-lg bg-[#672be0] px-5 font-bold text-white transition hover:bg-[#4f1fb0] active:translate-y-px max-[560px]:w-full"
          >
            추가
          </Link>
        </div>

        <p className="my-3 min-h-5 text-sm text-[#d83a52]" role="status" aria-live="polite" />

        <div
          className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-[#f0edf7] p-1"
          role="tablist"
          aria-label="Todo 상태 필터"
        >
          {FILTER_OPTIONS.map((filterOption) => {
            const isSelected = selectedFilter === filterOption.value;
            const href = buildTodosHref(
              selectedDateKey,
              filterOption.value === "all" ? undefined : filterOption.value,
            );

            return (
              <Link
                key={filterOption.value}
                className={`flex min-h-10 items-center justify-center rounded-md px-3 text-sm font-bold transition ${
                  isSelected
                    ? "bg-[#672be0] text-white shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
                    : "bg-transparent text-[#747080] hover:text-[#672be0]"
                }`}
                href={href}
                role="tab"
                aria-selected={isSelected}
              >
                {filterOption.label}
              </Link>
            );
          })}
        </div>

        <TodoList todos={todos} />
      </section>
    </main>
  );
}
