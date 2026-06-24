import Link from "next/link";

type DateNavigatorProps = {
  selectedDateText: string;
  previousHref: string;
  nextHref: string;
};

export default function DateNavigator({
  selectedDateText,
  previousHref,
  nextHref,
}: DateNavigatorProps) {
  return (
    <div
      className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg bg-[#f0edf7] p-2.5"
      aria-label="일간 Todo 날짜 선택"
    >
      <Link
        className="flex min-h-10 min-w-14 items-center justify-center rounded-md bg-white px-3 text-sm font-bold text-[#672be0] transition hover:bg-[#672be0] hover:text-white hover:shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
        href={previousHref}
      >
        이전
      </Link>
      <p className="m-0 text-center text-base font-bold leading-snug text-[#1f1f29]">
        {selectedDateText}
      </p>
      <Link
        className="flex min-h-10 min-w-14 items-center justify-center rounded-md bg-white px-3 text-sm font-bold text-[#672be0] transition hover:bg-[#672be0] hover:text-white hover:shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
        href={nextHref}
      >
        다음
      </Link>
    </div>
  );
}
