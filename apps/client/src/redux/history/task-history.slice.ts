import { createSlice } from '@reduxjs/toolkit';
import { HistoryState } from './types';
import { getTaskHistory } from './history.api';

const initialState: HistoryState = {
  history: [],
  status: "idle",
  error: null,
};

const taskHistorySlice = createSlice({
  name: 'taskHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaskHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTaskHistory.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.status = "succeeded";
          state.history = action.payload.task_history;
        } else {
          state.status = "failed";
          state.error = action.payload.error.message;
        }
      })
      .addCase(getTaskHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  }
});

export default taskHistorySlice.reducer;