export default function TodosLoading() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f7f5fb] px-5 py-16 max-[560px]:px-3.5 max-[560px]:py-7">
      <section className="w-full max-w-2xl rounded-lg border border-[#e7e1f2] bg-white p-9 shadow-[0_20px_45px_rgba(32,20,57,0.12)] max-[560px]:p-6">
        <div className="mb-7">
          <div className="mb-3 h-4 w-28 rounded-md bg-[#f0edf7]" />
          <div className="h-10 w-40 rounded-md bg-[#f0edf7]" />
        </div>

        <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg bg-[#f0edf7] p-2.5">
          <div className="h-10 w-14 rounded-md bg-white" />
          <div className="mx-auto h-5 w-48 rounded-md bg-white" />
          <div className="h-10 w-14 rounded-md bg-white" />
        </div>

        <div className="mb-4 h-12 rounded-lg bg-[#f0edf7]" />

        <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-[#f0edf7] p-1">
          <div className="h-10 rounded-md bg-white" />
          <div className="h-10 rounded-md bg-white" />
          <div className="h-10 rounded-md bg-white" />
        </div>

        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] items-center gap-3.5 rounded-lg border border-[#e7e1f2] bg-white p-4 max-[560px]:grid-cols-1"
            >
              <div className="h-5 w-2/3 rounded-md bg-[#f0edf7]" />
              <div className="flex gap-2 max-[560px]:grid max-[560px]:grid-cols-3">
                <div className="h-9 w-14 rounded-lg bg-[#f0edf7]" />
                <div className="h-9 w-14 rounded-lg bg-[#f0edf7]" />
                <div className="h-9 w-14 rounded-lg bg-[#f0edf7]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
