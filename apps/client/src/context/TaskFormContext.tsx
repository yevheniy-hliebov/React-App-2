import { createContext, useContext, useState } from "react";
import { Task } from "../redux/task/types";

export type TaskFormProps = {
  boardId?: number;
  listId?: number;
  task?: Task;
  isEditTaskForm?: boolean;
}

type TaskFormType = TaskFormProps & {
  isOpen: boolean;
  openTaskForm: (props: TaskFormProps) => void;
  closeTaskForm: () => void;
};

const TaskFormContext = createContext<TaskFormType | undefined>(undefined);

export const useTaskForm = () => {
  const context = useContext(TaskFormContext);
  if (!context) {
    throw new Error('useTaskForm must be used within a TaskFormProvider');
  }
  return context;
};

type TaskFormProviderProps = {
  children?: React.ReactNode;
}

export const TaskFormProvider: React.FC<TaskFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  const [listId, setListId] = useState<number | undefined>(undefined);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isEditTaskForm, setIsEditTaskForm] = useState<boolean>(false);

  const openTaskForm = ({ boardId, listId, task, isEditTaskForm }: TaskFormProps) => {
    setIsOpen(true);
    setBoardId(boardId);
    setListId(listId);
    setTask(task);
    setIsEditTaskForm(isEditTaskForm || false);
  };

  const closeTaskForm = () => {
    setIsOpen(false);
    setBoardId(undefined);
    setListId(undefined);
    setTask(undefined);
    setIsEditTaskForm(false);
  };

  return (
    <TaskFormContext.Provider value={{ isOpen, boardId, listId, task, isEditTaskForm, openTaskForm, closeTaskForm }}>
      {children}
    </TaskFormContext.Provider>
  );
};