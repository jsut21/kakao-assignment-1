function DateNavigator({ selectedDateText, onMoveDate }) {
  return (
    <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg bg-[#f0edf7] p-2.5" aria-label="일간 Todo 날짜 선택">
      <button
        className="min-h-10 min-w-14 rounded-md bg-white px-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white hover:shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
        type="button"
        onClick={() => onMoveDate(-1)}
      >
        이전
      </button>
      <p className="m-0 text-center text-base font-bold leading-snug text-[#1f1f29]">{selectedDateText}</p>
      <button
        className="min-h-10 min-w-14 rounded-md bg-white px-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white hover:shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
        type="button"
        onClick={() => onMoveDate(1)}
      >
        다음
      </button>
    </div>
  );
}

export default DateNavigator;
