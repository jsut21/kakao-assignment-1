function TodoForm({ todoInputText, onInputChange, onSubmit }) {
  return (
    <form className="grid grid-cols-[1fr_auto] gap-2.5 max-[560px]:grid-cols-1" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="todoInput">
        할 일 입력
      </label>
      <input
        id="todoInput"
        className="min-h-12 w-full rounded-lg border border-[#e7e1f2] bg-white px-4 text-[#1f1f29] outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
        type="text"
        placeholder="오늘 할 일을 입력하세요"
        autoComplete="off"
        value={todoInputText}
        onChange={(event) => onInputChange(event.target.value)}
      />
      <button
        className="min-h-12 rounded-lg bg-brand px-5 font-bold text-white transition hover:bg-brand-dark active:translate-y-px max-[560px]:w-full"
        type="submit"
      >
        추가
      </button>
    </form>
  );
}

export default TodoForm;
