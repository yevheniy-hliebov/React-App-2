export type PriorityState = {
  priorities: Priority[],
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string | object | null | undefined,
}

export type Priority = {
  id: number
  name: string
}