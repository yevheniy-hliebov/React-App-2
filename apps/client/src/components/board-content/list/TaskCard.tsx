import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, ReducerStates } from "../../../redux/store";
import { Task } from "../../../redux/task/types";
import Dropdown, { DropdownOption } from "../../form-elements/Dropdown";
import ContextMenu, { ContextMenuOption } from "../../ContextMenu";
import { CalendarIcon, DeleteIcon, EditIcon } from "../../icons";
import { formatDate } from "../../../utils/format-date";
import { List } from "../../../redux/list/types";
import { Priority } from "../../../redux/priority/types";
import { deleteTask, moveTask } from "../../../redux/task/task.api";
import { useTaskForm } from "../../../context/TaskFormContext";
import { useTaskPopup } from "../../../context/TaskPopupContext";

type TaskCardProps = {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { openTaskForm } = useTaskForm();
  const { openTaskPopup } = useTaskPopup();

  const statePriorities = useSelector((state: ReducerStates) => state.priorities);
  const stateLists= useSelector((state: ReducerStates) => state.lists);
  let priority = statePriorities.priorities.find((priority: Priority) => task.priority_id === priority.id);

  let options = stateLists.lists
    .filter((list: List) => task.list_id !== list.id)
    .map((list: List) => ({ label: list.name, value: list.id }));


  const handleMoveTask = (option: DropdownOption) => {
    dispatch(moveTask({ task: task, newListId: +option.value }))
  };

  const OnSelectContextMenu = (option: ContextMenuOption) => {
    if (option.label === 'Edit') {
      openTaskForm({ boardId: task.board_id, listId: task.list_id, task: task, isEditTaskForm: true })
    } else if (option.label === 'Delete') {
      dispatch(deleteTask(task));
    }
  }

  const contextMenuOptions = [
    { label: 'Edit', icon: <EditIcon /> },
    { label: 'Delete', icon: <DeleteIcon /> },
  ]

  const handleOpenTask = () => {
    openTaskPopup(task);
  }

  return (
    <div className='bg-white flex flex-col gap-[16px] items-start border-[1px] px-[15px] py-[20px] rounded-[10px] border-slate-300 shadow-[2px_2px_4px_rgba(0,0,0,0.1)]'>
      <div className="flex w-full justify-between">
        <div className="text-left leading-6 flex flex-col gap-[8px]">
          <div className="text-[20px] cursor-pointer" onClick={handleOpenTask}>{task.name}</div>
          <div className="font-medium tracking-wide text-[14px] text-gray-500 leading-7">
            {task.description}
          </div>
        </div>
        <div className="shrink-0 top-[20px] right-[16px] options flex">
          <ContextMenu options={contextMenuOptions} onSelect={OnSelectContextMenu} />
        </div>
      </div>
      {task.due_date ? (
        <div className="flex items-center gap-[8px]">
          <CalendarIcon className='size-[27px]' />
          <span className='font-medium text-[16px] leading-6 text-gray-500'>
            {formatDate(task.due_date, 'DD, dd MONTH')}
          </span>
        </div>
      ) : null}
      {priority ? (
        <div className="inline-flex items-center gap-[8px] px-[12px] py-[5px] rounded-[20px] bg-gray-100">
          <span className='size-[10px] bg-slate-400 rounded-md'></span>
          <span className='text-[16px] leading-6 text-gray-500'>
            {priority.name}
          </span>
        </div>
      ) : null}
      {options.length > 0 ? <Dropdown label="Move to:" options={options} onSelect={handleMoveTask} /> : null}
    </div>
  )
}

export default TaskCard