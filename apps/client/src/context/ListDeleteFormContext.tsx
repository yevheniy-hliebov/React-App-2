import { createContext, useContext, useState } from "react";
import { List } from "../redux/list/types";

type ListDeleteFormType = {
  isOpen: boolean;
  boardId?: number;
  list?: List;
  openListDeleteForm: (boardId: number, list: List) => void;
  closeForm: () => void;
};

const ListDeleteFormContext = createContext<ListDeleteFormType | undefined>(undefined);

export const useListDeleteForm = () => {
  const context = useContext(ListDeleteFormContext);
  if (!context) {
    throw new Error('useListDeleteForm must be used within a ListDeleteFormProvider');
  }
  return context;
};

type ListDeleteFormProviderProps = {
  children?: React.ReactNode;
}

export const ListDeleteFormProvider: React.FC<ListDeleteFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  const [list, setList] = useState<List | undefined>(undefined);

  const openListDeleteForm = (boardId: number, list: List) => {
    setIsOpen(true);
    setBoardId(boardId)
    setList(list);
  };
  
  const closeForm = () => {
    setIsOpen(false);
    setBoardId(undefined)
    setList(undefined);
  };

  return (
    <ListDeleteFormContext.Provider value={{ isOpen, boardId, list, openListDeleteForm, closeForm }}>
      {children}
    </ListDeleteFormContext.Provider>
  );
};