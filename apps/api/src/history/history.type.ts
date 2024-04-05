export type CreateHistoryDto = {
  action: string,
  model: string,
  model_id: number,
  data: string,
  field?: string,
  old_value?: string,
  new_value?: string,
}

export type MessageEntry = {
  id: number;
  message: string;
  created_at: Date | string;
}