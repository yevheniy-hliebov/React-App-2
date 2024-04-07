export type BoardState = {
  boards: Board[],
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string| object | null | undefined,
}

export type Board = {
  id: number;
  name: string;
  created_at: Date | string;
  updated_at: Date | string;
}
export type CreateBoardData = Pick<Board, 'name'>

export type UpdateBoardData = {
  id: number;
  boardData: Pick<Board, 'name'>
}