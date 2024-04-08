import React from 'react'
import Button from '../form-elements/Button';
import { AddIcon } from '../icons';
import { useOpenBoard } from '../../context/BoardContext';
import { useListForm } from '../../context/ListFormContext';
import BoardHistory from './history/BoardHistory';

const BoardHeader: React.FunctionComponent = () => {
  const { activeBoard } = useOpenBoard();
  const { openListForm } = useListForm();

  const handelClickCreateList = () => {
    if (activeBoard?.id)
      openListForm({ title: 'Create new list', boardId: activeBoard.id });
  }

  return (
    <header className="py-[18px] flex items-center justify-between gap-[10px] max-[1000px]:flex-col">
      <h1 className="w-full font-bold text-[35px] max-[1000px]:text-center">{activeBoard?.name}</h1>

      <div className="shrink-0 flex items-center justify-between gap-[10px]">
        <BoardHistory />
        <Button icon={AddIcon} onClick={handelClickCreateList}>Create new list</Button>
      </div>
    </header>
  )
}

export default BoardHeader