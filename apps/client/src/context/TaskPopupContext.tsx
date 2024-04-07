import { createContext, useContext, useState } from "react";
import { Task } from "../redux/task/types";

type TaskPopupType = {
  isOpen: boolean;
  task?: Task;
  openTaskPopup: (task: Task) => void;
  closeTaskPopup: () => void;
};

const TaskPopupContext = createContext<TaskPopupType | undefined>(undefined);

export const useTaskPopup = () => {
  const context = useContext(TaskPopupContext);
  if (!context) {
    throw new Error('useTaskPopup must be used within a TaskPopupProvider');
  }
  return context;
};

type TaskPopupProviderProps = {
  children?: React.ReactNode;
}

export const TaskPopupProvider: React.FC<TaskPopupProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task | undefined>(undefined);

  const openTaskPopup = (task: Task) => {
    setIsOpen(true);
    setTask(task);
  };

  const closeTaskPopup = () => {
    setIsOpen(false);
    setTask(undefined);
  };

  return (
    <TaskPopupContext.Provider value={{ isOpen, task, openTaskPopup, closeTaskPopup }}>
      {children}
    </TaskPopupContext.Provider>
  );
};