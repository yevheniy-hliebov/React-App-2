import { useSelector } from 'react-redux';

import { useTaskForm } from '../../context/TaskFormContext';
import { useTaskPopup } from '../../context/TaskPopupContext';

import DefaultPopup from './DefaultPopup'
import { SvgType, CalendarIcon, CycleIcon, EditIcon, SellIcon } from '../icons';

import { formatDate } from '../../utils/format-date';
import { ReducerStates } from '../../redux/store';
import { getTaskAttribute } from '../../utils/get-task-attribute';
import { Task } from '../../redux/task/types';
import Button from '../form-elements/Button';
import TaskHistory from '../board-content/history/TaskHistory';

const TaskPopup = () => {
  const { isOpen, task, closeTaskPopup } = useTaskPopup();
  const { openTaskForm } = useTaskForm();

  const stateTasklists = useSelector((state: ReducerStates) => state.lists);
  const statePriorities = useSelector((state: ReducerStates) => state.priorities);
  const status = getTaskAttribute(stateTasklists.lists, task?.list_id, 'name');
  const priority = getTaskAttribute(statePriorities.priorities, task?.priority_id, 'name');

  const handleClickEdit = () => {
    openTaskForm({ boardId: task?.board_id, listId: task?.list_id, task, isEditTaskForm: true })
    closeTaskPopup();
  }

  return (
    <DefaultPopup opened={isOpen} handleClose={closeTaskPopup} classNameBody='flex max-h-full overflow-hidden max-[960px]:flex-col max-[960px]:overflow-y-auto' classNameWindow='w-full max-[960px]:overflow-hidden'>
      <div className="body-info max-h-full overflow-y-auto flex-1 flex flex-col gap-[50px] p-[45px] max-lg:p-[25px] max-[960px]:overflow-y-visible max-[960px]:gap-[35px]">
        {renderTaskInfo(task, handleClickEdit, status, priority)}
      </div>
      {task ? <TaskHistory id={task.id} /> : null}
    </DefaultPopup>
  )
}

const renderTaskInfo = (task: Task | undefined, handleClickEdit: () => void, status: string | undefined, priority: string | undefined) => {
  if (!task) return null;

  return (
    <>
      <div className="body-info__params flex flex-col gap-[25px] max-[960px]:gap-[15px]">
        {renderTaskHeader(task, handleClickEdit)}
        {renderTaskParams(task, status, priority)}
      </div>
      {renderTaskDescription(task)}
    </>
  );
}

const renderTaskHeader = (task: Task, handleClickEdit: () => void) => {
  return (
    <div className="body-info__title-row flex justify-between items-start gap-[25px] max-[500px]:flex-col max-[500px]:gap-[15px]">
      <div className="body-info__title font-bold text-[32px] max-[960px]:text-[24px]">{task.name}</div>
      <Button onClick={handleClickEdit} icon={EditIcon} variant='border' className='shrink-0' classNameIcon='text-gray-400'>
        Edit task
      </Button>
    </div>
  );
}

const renderTaskParams = (task: Task, status: string | undefined, priority: string | undefined) => {
  return (
    <div className="body-info__params-rows text-[20px] max-sm:text-[16px]">
      {renderTaskParam('Status', status, CycleIcon)}
      {renderTaskParam('Due date', task.due_date ? formatDate(task.due_date, 'DD, dd MONTH') : undefined, CalendarIcon)}
      {renderTaskParam('Priority', task.priority_id ? priority : undefined, SellIcon)}
    </div>
  );
}

const renderTaskParam = (name: string, value: string | undefined, Icon: SvgType) => {
  return (
    <div className="body-info__params-row grid grid-cols-[212px_auto] items-start gap-[10px] max-sm:grid-cols-[112px_auto]">
      <div className="body-info__params-field text-gray-400 flex gap-[10px] items-center p-[5px] max-w-[212px]">
        <Icon className='max-sm:size-[20px]'/>
        {name}
      </div>
      <div className="body-info__params-value p-[5px] font-medium">
        {value ? value :
          <span className='italic text-gray-300'>not assigned</span>
        }
      </div>
    </div>
  );
}

const renderTaskDescription = (task: Task) => {
  if (!task.description) return null;

  return (
    <div className="body-info__desc flex flex-col gap-[15px]">
      <div className="body-info__desc-title font-bold text-[24px]">Description</div>
      <div className="body-info__desc-text font-medium text-[18px] text-gray-500 max-sm:text-[16px]">{task.description}</div>
    </div>
  );
}

export default TaskPopup
