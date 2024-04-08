import React from 'react'
import { List } from '../../redux/list/types';
import HeaderList from './list/HeaderList';
import ButtonAddCard from './list/ButtonAddCard';
import { useSelector } from 'react-redux';
import { ReducerStates } from '../../redux/store';
import TaskList from './list/TaskList';
import { TaskFormProvider } from '../../context/TaskFormContext';
import TaskForm from '../popups/TaskForm';
import { TaskPopupProvider } from '../../context/TaskPopupContext';
import TaskPopup from '../popups/TaskPopup';

const BoardLists: React.FunctionComponent = () => {
  const stateLists = useSelector((state: ReducerStates) => state.lists);
  return (
    <TaskFormProvider>
      <TaskPopupProvider>
        <div className='w-full flex-1 overflow-auto'>
          <div className="relative">
            <div className="sticky z-[20] top-0 left-0 flex">
              {stateLists.lists.map((list: List) => {
                return (
                  <div key={'board__column-header' + list.id} className='board__column-header shrink-0 w-[300px] flex flex-col gap-[15px] pr-[25px] bg-white pb-6'>
                    <HeaderList list={list} count_tasks={list.tasks?.length || 0} />
                    <ButtonAddCard board_id={list.board_id} list_id={list.id} />
                  </div>
                )
              })}
            </div>

            <div className="flex pb-[188px]">
              {stateLists.lists.map((list: List) => {
                return <TaskList key={list.id} list={list} />
              })}
            </div>
          </div>
        </div>
        {/* Form for creating or editing task */}
        <TaskForm />
        {/* Modal window with task info*/}
        <TaskPopup />
      </TaskPopupProvider>
    </TaskFormProvider>
  )
}

export default BoardLists