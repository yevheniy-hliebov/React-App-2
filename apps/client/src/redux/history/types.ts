export type HistoryState = {
  history: HistoryEntry[],
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string | object | null | undefined,
}

export type HistoryEntry = {
  id: number;
  action: string;
  model: string;
  model_id: number;
  data: string;
  field: string;
  old_value: string;
  new_value: string;
  created_at: Date;
}