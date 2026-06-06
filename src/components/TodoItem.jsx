import { useEffect, useState } from "react";

function TodoItem({ todo, onShowMessage, onUpdateTodo, onToggleTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.text);

  // Todo 텍스트가 외부에서 바뀌면 인라인 입력창 값도 최신 상태로 맞춥니다.
  useEffect(() => {
    setEditingText(todo.text);
  }, [todo.text]);

  function startEditing() {
    setEditingText(todo.text);
    setIsEditing(true);
    onShowMessage("");
  }

  function cancelEditing() {
    setEditingText(todo.text);
    setIsEditing(false);
    onShowMessage("");
  }

  function saveEditedTodo() {
    const trimmedEditingText = editingText.trim();

    if (!trimmedEditingText) {
      onShowMessage("수정할 내용을 입력해주세요.");
      return;
    }

    onUpdateTodo(todo.id, trimmedEditingText);
    setIsEditing(false);
  }

  return (
    <li className={`grid grid-cols-[1fr_auto] items-center gap-3.5 rounded-lg border border-[#e7e1f2] bg-white p-4 max-[560px]:grid-cols-1 ${todo.isCompleted ? "text-[#747080]" : "text-[#1f1f29]"}`}>
      {isEditing ? (
        <input
          className="min-h-10 w-full rounded-md border border-[#e7e1f2] bg-white px-3 outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(103,43,224,0.12)]"
          value={editingText}
          onChange={(event) => setEditingText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              saveEditedTodo();
            }

            if (event.key === "Escape") {
              cancelEditing();
            }
          }}
          autoFocus
        />
      ) : (
        <p className={`m-0 [overflow-wrap:anywhere] leading-normal ${todo.isCompleted ? "line-through" : ""}`}>{todo.text}</p>
      )}

      <div className="flex gap-2 max-[560px]:grid max-[560px]:grid-cols-3">
        {isEditing ? (
          <>
            <button className="min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold text-[#1f1f29] transition hover:bg-[#e4dcf4] max-[560px]:w-full" type="button" onClick={saveEditedTodo}>
              저장
            </button>
            <button className="min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold text-[#1f1f29] transition hover:bg-[#e4dcf4] max-[560px]:w-full" type="button" onClick={cancelEditing}>
              취소
            </button>
          </>
        ) : (
          <button className="min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold text-[#1f1f29] transition hover:bg-[#e4dcf4] max-[560px]:w-full" type="button" onClick={startEditing}>
            수정
          </button>
        )}
        {isEditing ?(
          <>
          </>
        ) : (
          <>
            <button className="min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold text-[#258a5d] transition hover:bg-[#e4dcf4] max-[560px]:w-full" type="button" onClick={() => onToggleTodo(todo.id)}>
              {todo.isCompleted ? "취소" : "완료"}
            </button>
            <button className="min-h-9 min-w-14 rounded-lg bg-[#f0edf7] px-3 text-sm font-bold text-[#d83a52] transition hover:bg-[#e4dcf4] max-[560px]:w-full" type="button" onClick={() => onDeleteTodo(todo.id)}>
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TodoItem;
