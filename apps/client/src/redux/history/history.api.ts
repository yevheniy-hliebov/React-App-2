import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getBoardHistory = createAsyncThunk('history/getBoardHistory', async (boardId: number) => {
  return await axios.get(`/api/history/boards/${boardId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const getTaskHistory = createAsyncThunk('history/getTaskHistory', async (taskId: number) => {
  return await axios.get(`/api/history/tasks/${taskId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});