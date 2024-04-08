import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DefaultPopup from './DefaultPopup'
import { EastIcon, Loader } from '../icons';
import { AppDispatch, ReducerStates } from '../../redux/store';
import { useListDeleteForm } from '../../context/ListDeleteFormContext';
import Dropdown, { DropdownOption } from '../form-elements/Dropdown';
import { List } from '../../redux/list/types';
import { deleteList } from '../../redux/list/list.api';
import Button from '../form-elements/Button';

function ListDeleteForm() {
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, boardId, list, closeForm } = useListDeleteForm();
  const [error, setError] = useState('');
  const [isDeleteTasks, setIsDeleteTasks] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<DropdownOption | null>(null);
  const stateLists = useSelector((state: ReducerStates) => state.lists);
  const [isLoading, setIsLoading] = useState(false);

  let options = stateLists.lists
    .filter((new_list: List) => list?.id !== new_list.id)
    .map((list: List) => ({ label: list.name, value: list.id }));

  const handleSelect = (option: DropdownOption) => {
    setSelectedList(option);
    setError('');
  };

  const handleServerResponse = (data: any) => {
    if ('error' in data) {
      if (data.error.message === `Task list with id ${list?.id} not found`) {
        setError('Task list not found, please refresh the page');
      } else if (data.error.message === `Task list with id ${selectedList?.value} not found`) {
        setError('New task list not found, please refresh the page');
      } else if (data.error.message === 'Task list with this name already exists') {
        setError(data.error.message);
      } else {
        setError('Internal server error, please try another time');
      }
    } else {
      handleCancel();
    }
  };

  const handleDispatch = (dispatchFunction: any) => {
    setIsLoading(true);
    dispatchFunction
      .then((data: any) => {
        handleServerResponse(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let newListId: number | undefined = undefined;
    if (!isDeleteTasks && selectedList) {
      newListId = Number(selectedList.value);
    }
    if (!isDeleteTasks && !selectedList) {
      setError('Select the list where to move or delete all tasks in the list')
    } else if (boardId && list) {
      handleDispatch(dispatch(deleteList({ boardId, listId: list.id, newListId: newListId })));
    }
  }

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeleteTasks(event.target.checked);
    setError('');
  }

  const handleCancel = () => {
    setSelectedList(null);
    setIsDeleteTasks(false);
    setError('');
    closeForm();
  }

  return (
    <DefaultPopup title='Delete or Move tasks' opened={isOpen} handleClose={handleCancel} >
      <form className='flex flex-col max-w-[700px] gap-3 px-[35px] py-[20px]' onSubmit={handleSumbit}>
        <div className="flex items-center mb-4">
          <input onChange={handleChangeCheckbox} type="checkbox" checked={isDeleteTasks} className="size-5 text-gray-600 bg-gray-100 border-gray-300 rounded focus:outline-gray-500 focus:ring-2" />
          <label className="ms-2 text-[14px] font-medium text-gray-900">Delete all tasks in the <span className='line-through'>{list?.name}</span> list without moving them to another list</label>
        </div>
        <div className={`grid items-center ${isDeleteTasks ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-[14px] mb-3">Or select a new list for moving task there</div>
          <div className="grid grid-cols-[1fr_1fr_minmax(0,256px)] max-sm:hidden">
            <div className='text-[12px]'>This list will be deleted:</div>
            <div></div>
            <div className='text-[12px]'>Move existing tasks to:</div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_minmax(0,256px)] items-center max-sm:grid-cols-1">
            <div className='font-medium text-[16px] min-w-[70px] line-through p-2 bg-slate-100 rounded-md text-slate-500'>{list?.name}</div>
            <EastIcon className='justify-self-end m-[20px] max-sm:rotate-90 max-sm:justify-self-center' />
            <Dropdown label={selectedList ? selectedList.label : 'Select new list'} options={options} onSelect={handleSelect} />
          </div>
        </div>
        {error && <p className="text-red-500 max-w-full">{error}</p>}
        <div className="flex flex-1 items-end gap-3 justify-center w-full">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='submit' className={`bg-red-500 hover:bg-red-600 active:bg-red-700 ${isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            <div className="relative">
              Delete
              <Loader className={`absolute top-1/2 left-full mx-1 -translate-y-1/2 size-6 fill-gray-50 m-0 ${isLoading ? 'opacity-1' : 'opacity-0'} transition-all`} />
            </div>
          </Button>
        </div>
      </form>
    </DefaultPopup>
  )
}

export default ListDeleteForm