import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./board/board.slice";
import listReducer from "./list/list.slice";
import priorityReducer from "./priority/priority.slice";
import boardHistoryReducer from "./history/board-history.slice";
import taskHistoryReducer from "./history/task-history.slice";
import { BoardState } from "./board/types";
import { ListState } from "./list/types";
import { PriorityState } from "./priority/types";
import { HistoryState } from "./history/types";

const store = configureStore({
  reducer: {
    boards: boardReducer,
    lists: listReducer,
    priorities: priorityReducer,
    boardHistory: boardHistoryReducer,
    taskHistory: taskHistoryReducer,
  }
})

export default store;

export type ReducerStates = {
  boards: BoardState;
  lists: ListState;
  priorities: PriorityState;
  boardHistory: HistoryState;
  taskHistory: HistoryState;
}

export type AppDispatch = typeof store.dispatch;