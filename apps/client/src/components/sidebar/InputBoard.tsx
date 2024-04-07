import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createBoard, updateBoard } from '../../redux/board/board.api';
import { Board } from '../../redux/board/types';
import { CheckIcon } from '../icons';

const InputBoard: React.FunctionComponent<{ board?: Board, isEdit?: boolean, onClosed?: () => void, bg?: string }> = ({ board, isEdit, onClosed, bg = '' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(board?.name || '');
  const [error, setError] = useState('');

  // close input board if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClosed!();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const validateName = (name: string) => {
    if (name.trim() === '') {
      setError('name cannot be empty.');
      return false;
    }
    if (name.length < 3 || name.length > 25) {
      setError('name must be between 3 and 25 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const createOrUpdate = () => {
    // validating name
    if (!validateName(name)) {
      return;
    }

    const handleDispatch = (dispatchFunction: any) => {
      dispatchFunction.then((data: any) => {
        if (data.payload.success === true) {
          onClosed!();
        } else {
          setError(data.payload.error.errors ? data.payload.error.errors[0] : data.payload.error.message);
        }
      });
    };

    if (isEdit && board) {
      // updating board name
      handleDispatch(dispatch(updateBoard({ id: board.id, boardData: { name: name } })));
    } else {
      // creating board
      handleDispatch(dispatch(createBoard({ name: name })));
    }
  }

  const handleClickSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    createOrUpdate()
  };

  const onClickEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      createOrUpdate();
    }
  }

  return (
    <div ref={ref} className={`p-[10px_15px] ${bg}`}>
      <div className="flex justify-between items-center gap-[10px]">
        <input onKeyDown={onClickEnter} type="text" name="name" id='task-name' value={name} onChange={handleChangeName} className='max-w-[175px] border-[1px] border-gray-500 rounded-[5px] text-[16px] px-2 py-1 focus:outline-gray-500' />

        <button onClick={handleClickSave} className='p-[3px] rounded-full hover:bg-gray-300 active:bg-gray-400 transition-all'>
          <CheckIcon />
        </button>
      </div>
      {error && <p className="text-red-500 max-w-full text-[14px]">{error}</p>}
    </div>
  )
}

export default InputBoard