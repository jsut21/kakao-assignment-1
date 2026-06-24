export type TodoStatus = "active" | "completed";

export type Todo = {
  id: number;
  title: string;
  date: string;
  status: TodoStatus;
};

export type GetTodosParams = {
  date?: string;
  status?: TodoStatus;
};
