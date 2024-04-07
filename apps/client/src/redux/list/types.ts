import { Task } from "../task/types";

export type ListState = {
  lists: List[],
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string | object | null | undefined,
}

export type List = {
  id: number;
  name: string;
  board_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  tasks: Task[]
}

export type CreateListData = {
  boardId: number;
  listData: Pick<List, 'name'>
}

export type UpdateListData = {
  boardId: number;
  listId: number;
  listData: Pick<List, 'name'>
}

export type DeleteList = {
  boardId: number;
  listId: number;
  newListId?: number;
}