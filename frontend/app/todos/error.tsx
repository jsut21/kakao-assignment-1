"use client";

import { useEffect } from "react";

type TodosErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function TodosError({ error, unstable_retry }: TodosErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f7f5fb] px-5 py-16 max-[560px]:px-3.5 max-[560px]:py-7">
      <section className="w-full max-w-2xl rounded-lg border border-[#e7e1f2] bg-white p-9 shadow-[0_20px_45px_rgba(32,20,57,0.12)] max-[560px]:p-6">
        <p className="m-0 mb-2 text-sm font-bold uppercase text-[#672be0]">Error</p>
        <h1 className="m-0 text-[28px] font-bold leading-tight text-[#1f1f29]">
          화면을 불러오지 못했습니다.
        </h1>
        <p className="mt-3 text-sm text-[#747080]">잠시 후 다시 시도해주세요.</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 min-h-12 rounded-lg bg-[#672be0] px-5 font-bold text-white transition hover:bg-[#4f1fb0] active:translate-y-px"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
