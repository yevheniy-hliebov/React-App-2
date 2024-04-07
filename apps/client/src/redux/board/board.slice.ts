import { createSlice } from "@reduxjs/toolkit";
import { createBoard, deleteBoard, getBoards, updateBoard } from "./board.api";
import { BoardState } from "./types";

const initialState: BoardState = {
  boards: [],
  status: "idle",
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.status = "succeeded";
          state.boards = action.payload.boards;
        } else {
          state.status = "failed";
          state.error = action.payload.error.message;
        }
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createBoard.fulfilled, (state, action) => {        
        if (action.payload.success === true) {
          state.boards.unshift(action.payload.board);
        }
      })

      .addCase(updateBoard.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const boardIndex = state.boards.findIndex(
            (board) => board.id === action.payload.board.id
          );
          state.boards[boardIndex] = action.payload.board;
        }
      })
      
      .addCase(deleteBoard.fulfilled, (state, action) => {       
        if (action.payload.success === true) {
          const boardIndex = state.boards.findIndex(
            (board) => board.id === action.payload.id
          );
          state.boards.splice(boardIndex, 1);
        }
      });
  },
});

export default boardSlice.reducer;
