import { createSlice } from "@reduxjs/toolkit";
import { PriorityState } from "./types";
import { getPriorities } from "./priority.api";

const initialState: PriorityState = {
  priorities: [],
  status: "idle",
  error: null,
};

const prioritySlice = createSlice({
  name: "priority",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPriorities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPriorities.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.status = "succeeded";
          state.priorities = action.payload.priorities;
        } else {
          state.status = "failed";
          state.error = action.payload.error.message;
        }
      })
      .addCase(getPriorities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default prioritySlice.reducer;
