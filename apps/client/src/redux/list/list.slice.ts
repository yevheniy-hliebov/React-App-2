import { createSlice } from "@reduxjs/toolkit";
import { ListState } from "./types";
import { createList, deleteList, getListsWithTasks, updateList } from "./list.api";
import { createTask, deleteTask, moveTask, updateTask } from "../task/task.api";
import { Task } from "../task/types";

const initialState: ListState = {
  lists: [],
  status: "idle",
  error: null,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListsWithTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getListsWithTasks.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.status = "succeeded";
          state.lists = action.payload.lists;
        } else {
          state.status = "failed";
          state.error = action.payload.error.message;
        }
      })
      .addCase(getListsWithTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createList.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          state.lists.push({ ...action.payload.list, tasks: [] });
        }
      })

      .addCase(updateList.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const listIndex = state.lists.findIndex(
            (list) => list.id === action.payload.list.id
          );
          state.lists[listIndex] = { ...action.payload.list, tasks: state.lists[listIndex]?.tasks || [] };
        }
      })

      .addCase(deleteList.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const listIndex = state.lists.findIndex(
            (list) => list.id === action.payload.listId
          );
          if (action.payload.newListId) {
            const newListIndex = state.lists.findIndex(
              (list) => list.id === action.payload.newListId
            );
            state.lists[newListIndex].tasks = state.lists[newListIndex].tasks?.concat(state.lists[listIndex].tasks || [])
          }
          state.lists.splice(listIndex, 1);
        }
      })

      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const task = action.payload.task;
          const listIndex = state.lists.findIndex(
            (list) => list.id === task.list_id
          );
          state.lists[listIndex].tasks = [...(state.lists[listIndex].tasks || []), task]
        }
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          const updatedTask = action.payload.task;
          const listIndex = state.lists.findIndex(
            (list) => list.id === updatedTask.list_id
          );
          const taskIndex = state.lists[listIndex].tasks.findIndex(
            (task) => task.id === updatedTask.id
          );
          state.lists[listIndex].tasks[taskIndex] = updatedTask;
        }
      })

      .addCase(moveTask.fulfilled, (state, action) => {
        const [oldListId, data] = action.payload;
        if (data.success === true) {
          const movedTask: Task = data.task;
          console.log(oldListId, movedTask);
          
          const oldListIndex = state.lists.findIndex(
            (list) => list.id === oldListId
          );
          const newListIndex = state.lists.findIndex(
            (list) => list.id === movedTask.list_id
          );
          const taskIndex = state.lists[oldListIndex].tasks.findIndex(
            (task) => task.id === movedTask.id
          );
          state.lists[oldListIndex].tasks.splice(taskIndex, 1)

          if (state.lists[newListIndex].tasks.length < 1) {
            state.lists[newListIndex].tasks = [movedTask];
          } else {
            state.lists[newListIndex].tasks.push(movedTask)
          }
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        if (action.payload.success === true) {          
          const listIndex = state.lists.findIndex(
            (list) => list.id === action.payload.listId
          );
          const taskIndex = state.lists[listIndex].tasks.findIndex(
            (task) => task.id === action.payload.taskId
          );
          state.lists[listIndex].tasks.splice(taskIndex, 1)
        }
      })
  },
});

export default listSlice.reducer;
