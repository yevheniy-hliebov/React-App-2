import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CreateBoardData, UpdateBoardData } from "./types";

export const getBoards = createAsyncThunk("boards/fetchBoards", async () => {
  return await axios.get("/api/boards")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const createBoard = createAsyncThunk("boards/createBoard", async (boardData: CreateBoardData) => {
  return await axios.post("/api/boards", boardData)
    .then((res) => {      
      return res.data;
    })
    .catch((err) => {      
      return err.response.data;
    });
});

export const updateBoard = createAsyncThunk("boards/updateBoard", async ({ id, boardData }: UpdateBoardData) => {
  return await axios.put(`/api/boards/${id}`, boardData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});

export const deleteBoard = createAsyncThunk("boards/deleteBoard", async (id: number) => {
  return await axios.delete(`/api/boards/${id}`)
    .then((res) => {
      return { ...res.data, id};
    })
    .catch((err) => {
      return err.response.data;
    });
});