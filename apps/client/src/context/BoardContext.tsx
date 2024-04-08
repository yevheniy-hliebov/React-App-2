import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, ReducerStates } from "../redux/store";
import { getBoards } from "../redux/board/board.api";
import { getListsWithTasks } from "../redux/list/list.api";
import { Board } from "../redux/board/types";

type BoardContextType = {
  activeBoard: Board | undefined;
  setActiveBoard: (boardId: number | undefined | null) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useOpenBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useOpenBoard must be used within a BoardProvider');
  }
  return context;
};

type BoardProviderProps = {
  children?: React.ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const stateBoards = useSelector((state: ReducerStates) => state.boards);
  const [boardId, setBoardId] = useState<number | undefined | null>(undefined);
  const board = stateBoards.boards.find((board: Board) => board.id === boardId);

  useEffect(() => {
    dispatch(getBoards());
  }, [])

  useEffect(() => {
    if (!boardId && stateBoards.boards.length > 0) {
      setActiveBoard(stateBoards.boards[0].id)
    }
  }, [stateBoards.boards, boardId])

  const setActiveBoard = (boardId: number | undefined | null) => {
    setBoardId(boardId);
    if (boardId) {
      dispatch(getListsWithTasks(boardId));
    }
  }

  return (
    <BoardContext.Provider value={{ activeBoard: board, setActiveBoard }}>
      {children}
    </BoardContext.Provider>
  );
};