export type TaskState = {
  tasks: Task[],
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string | object | null | undefined,
}

export type Task = {
  id: number
  name: string
  description: string | null
  due_date: Date | null
  priority_id: number | null
  list_id: number
  board_id: number
  created_at: Date
  updated_at: Date
}

export type CreateTaskData = {
  boardId: number;
  listId: number;
  taskData: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>> & { name: string }
}

export type UpdateTaskData = {
  boardId: number;
  listId: number;
  taskId: number;
  taskData: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
}

export type moveTaskData = {
  task: Task;
  newListId: number
}

export type DeleteTask = {
  boardId: number;
  listId: number;
  taskId: number;
}