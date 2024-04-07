import React, { useState } from 'react'
import { AddIcon, CloseIcon } from '../icons'
import { useSelector } from 'react-redux';
import { ReducerStates } from '../../redux/store';
import { Board } from '../../redux/board/types';
import BoardItem from './BoardItem';
import InputBoard from './InputBoard';
import BurgerButton from '../BurgerButton';
import useWindowWide from '../../hook/useWindowWide';

const SideBar: React.FunctionComponent = () => {
  const [isCreate, setIsCreate] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const wide = useWindowWide(800);
  const stateBoards = useSelector((state: ReducerStates) => state.boards);

  const handleAddBoard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCreate(true);
  }

  return (
    <div className="relative z-50 max-[800px]:px-[35px] max-[800px]:pt-[20px] max-[600px]:px-[15px]">
      {!wide ?
        <BurgerButton isOpen={isOpened} onClick={() => { setIsOpened(prevState => !prevState) }} className='min-[800px]:none' />
        : null}
      <div className={`relative w-[260px] h-screen shrink-0 bg-gray-50 shadow-[4px_0px_8px_rgba(0,0,0,0.1)] py-[15px] flex flex-col max-[800px]:pt-[25px] max-[800px]:absolute top-0 ${!wide && !isOpened ? '-left-[260px]' : 'left-0'} transition-all`}>
        {/* CLose Icon */}
        {!wide ?
          <button className='shrink-0 size-[24px] absolute top-[5px] right-[18px]' onClick={() => { setIsOpened(false) }}>
            <CloseIcon className={`absolute inset-0 ${!wide && !isOpened ? 'opacity-0' : 'opacity-100'} transition-all`} />
          </button>
          : null}

        {/* Heading board list & button create new board */}
        <div className="p-[10px_15px] flex justify-between items-center gap-[10px]">
          <h2 className='text-[20px] font-bold'>
            Your boards
          </h2>
          <button onClick={handleAddBoard} className='p-[3px] rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all'>
            <AddIcon />
          </button>
        </div>

        {/* Input for create board */}
        {isCreate ? <InputBoard onClosed={() => setIsCreate(false)} /> : null}

        {/* List boards */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {stateBoards.boards ? stateBoards.boards.map((board: Board) => {
            return (
              <BoardItem key={board.id} board={board} />
            )
          }) : null}
        </div>
      </div>
    </div>
  )
}

export default SideBar