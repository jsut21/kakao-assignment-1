import TodoForm from "../_components/TodoForm";

type NewTodoPageProps = {
  searchParams: Promise<{
    date?: string | string[];
  }>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const { date } = await searchParams;
  const defaultDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date
      : undefined;

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
            새 Todo
          </h1>
        </header>

        <TodoForm mode="create" defaultDate={defaultDate} />
      </section>
    </main>
  );
}
