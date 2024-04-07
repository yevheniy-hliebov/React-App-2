import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CreateListData, DeleteList, UpdateListData } from "./types";

export const getListsWithTasks = createAsyncThunk("lists/getListsWithTasks", async (boardId: number) => {
  return await axios.get(`/api/boards/${boardId}/lists?includeTasks=true`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const createList = createAsyncThunk("lists/createList", async ({ boardId, listData }: CreateListData) => {
  return await axios.post(`/api/boards/${boardId}/lists`, listData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const updateList = createAsyncThunk("lists/updateList", async ({ boardId, listId, listData }: UpdateListData) => {
  return await axios.put(`/api/boards/${boardId}/lists/${listId}`, listData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const deleteList = createAsyncThunk("lists/deleteList", async ({ boardId, listId, newListId = undefined }: DeleteList) => {
  return await axios.delete(`/api/boards/${boardId}/lists/${listId}${newListId ? `?newListId=${newListId}` : ''}`)
    .then((res) => {
      return { ...res.data, listId, newListId };
    })
    .catch((err) => {
      return err.response.data;
    });
});