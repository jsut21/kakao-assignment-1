const FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function FilterTabs({ currentFilter, onChangeFilter }) {
  return (
    <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-[#f0edf7] p-1" role="tablist" aria-label="Todo 상태 필터">
      {FILTER_OPTIONS.map((filterOption) => {
        const isSelected = currentFilter === filterOption.value;

        return (
          <button
            key={filterOption.value}
            className={`min-h-10 rounded-md px-3 text-sm font-bold transition ${
              isSelected
                ? "bg-brand text-white shadow-[0_8px_18px_rgba(103,43,224,0.18)]"
                : "bg-transparent text-[#747080] hover:text-brand"
            }`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChangeFilter(filterOption.value)}
          >
            {filterOption.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
