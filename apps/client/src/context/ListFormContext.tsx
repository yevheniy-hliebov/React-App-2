import React, { createContext, useContext, useState } from 'react';
import { List } from '../redux/list/types';

export type ListFormProps = {
  title?: string;
  boardId?: number;
  list?: List;
  isEditForm?: boolean;
}

type ListFormContextType = ListFormProps & {
  isOpen: boolean;
  openListForm: (props?: ListFormProps) => void;
  closeForm: () => void;
};

const ListFormContext = createContext<ListFormContextType | undefined>(undefined);

export const useListForm = () => {
  const context = useContext(ListFormContext);
  if (!context) {
    throw new Error('useListForm must be used within a ListFormProvider');
  }
  return context;
};

type ListFormProviderProps = {
  children?: React.ReactNode;
}

export const ListFormProvider: React.FC<ListFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [list, setList] = useState<List | undefined>(undefined);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  const [isEditForm, setIsEditForm] = useState<boolean>(false);

  const openListForm = (props?: ListFormProps) => {
    setIsOpen(true);
    setTitle(props?.title);
    setList(props?.list);
    setBoardId(props?.boardId);
    setIsEditForm(props?.isEditForm || false);
  };

  const closeForm = () => {
    setIsOpen(false);
    setTitle(undefined);
    setList(undefined);
    setIsEditForm(false);
  };

  return (
    <ListFormContext.Provider value={{ isOpen, title, list, isEditForm, boardId, openListForm, closeForm }}>
      {children}
    </ListFormContext.Provider>
  );
};
