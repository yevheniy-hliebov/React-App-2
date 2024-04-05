import { Task, List } from "@prisma/client";

export type TaskWithList = Task & {
  list?: List
}