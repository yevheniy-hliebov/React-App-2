import { createSlice } from '@reduxjs/toolkit';
import { HistoryState } from './types';
import { getBoardHistory } from './history.api';

const initialState: HistoryState = {
  history: [],
  status: "idle",
  error: null,
};

const boardHistorySlice = createSlice({
  name: 'boardHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoardHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBoardHistory.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.status = "succeeded";
          state.history = action.payload.history;
        } else {
          state.status = "failed";
          state.error = action.payload.error.message;
        }
      })
      .addCase(getBoardHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  }
});

export default boardHistorySlice.reducer;