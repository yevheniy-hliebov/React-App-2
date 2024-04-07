import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useListForm } from '../../context/ListFormContext';

import DefaultPopup from './DefaultPopup';
import Loader from '../../assets/loader.svg?react'
import Button from '../form-elements/Button';
import { createList, updateList } from '../../redux/list/list.api';

const ListForm: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, closeForm, title, boardId, list, isEditForm } = useListForm();
  const [taskName, setTaskName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set initial task name if provided
    if (list) {
      setTaskName(list.name || '');
    }
  }, [list]);

  const validateTaskName = (taskName: string) => {
    if (taskName.trim() === '') {
      setError('Task list name cannot be empty.');
      return false;
    }
    if (taskName.length < 3 || taskName.length > 25) {
      setError('Task list name must be between 3 and 25 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleServerResponse = (data: any) => {
    if ('payload' in data && data.payload.success === false) {
      setError(data.payload.error.message);
    } else {
      handleClose();
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

    if (!validateTaskName(taskName)) {
      return;
    }

    if (!isEditForm && boardId) {
      handleDispatch(dispatch(createList({ boardId, listData: { name: taskName } })));
    } else if (list && boardId) {
      handleDispatch(dispatch(updateList({ boardId, listId: list.id, listData: { name: taskName } })));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleClose = () => {
    setTaskName('');
    setError('');
    closeForm();
  }

  return (
    <DefaultPopup title={title} opened={isOpen} handleClose={handleClose}>
      <form className='flex flex-col w-[425px] gap-3 px-[35px] py-[20px] max-sm:max-w-[280px]' onSubmit={handleSumbit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="tasklist-name" className='font-medium text-[18px]'>Name</label>
          <input type="text" name="name" id='tasklist-name' value={taskName} onChange={handleChange} className='border-[1px] border-gray-500 rounded-[5px] text-[18px] px-[10px] py-2 focus:outline-gray-500' />
          {error && <p className="text-red-500 max-w-full">{error}</p>}
        </div>
        <Button type='submit' className={`${isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <div className="relative">
            {!isEditForm ? 'Create' : 'Save'}
            <Loader className={`absolute top-1/2 left-full mx-1 -translate-y-1/2 size-6 fill-gray-50 m-0 ${isLoading ? 'opacity-1' : 'opacity-0'} transition-all`} />
          </div>
        </Button>
      </form>
    </DefaultPopup>
  );
};

export default ListForm;
