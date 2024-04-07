import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CreateTaskData, moveTaskData, Task, UpdateTaskData } from "./types";

export const createTask = createAsyncThunk("tasks/createTask", async ({ boardId, listId, taskData }: CreateTaskData) => {
  return await axios.post(`/api/boards/${boardId}/lists/${listId}/tasks`, taskData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ boardId, listId, taskId, taskData }: UpdateTaskData) => {
  return await axios.put(`/api/boards/${boardId}/lists/${listId}/tasks/${taskId}`, taskData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const moveTask = createAsyncThunk("tasks/moveTask", async ({ task, newListId }: moveTaskData) => {
  return await axios.put(`/api/boards/${task.board_id}/lists/${task.list_id}/tasks/${task.id}/move-to`, { list_id: newListId })
    .then((res) => {
      return [task.list_id, res.data];
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (task: Task) => {
  return await axios.delete(`/api/boards/${task.board_id}/lists/${task.list_id}/tasks/${task.id}`)
    .then((res) => {
      return { ...res.data, listId: task.list_id, taskId: task.id };
    })
    .catch((err) => {
      return err.response.data;
    });
});