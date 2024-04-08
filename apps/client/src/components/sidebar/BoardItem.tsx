import React, { useState } from 'react'
import { Board } from '../../redux/board/types'
import ContextMenu, { ContextMenuOption } from '../ContextMenu'
import { DeleteIcon, EditIcon } from '../icons'
import { AppDispatch } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { deleteBoard } from '../../redux/board/board.api'
import InputBoard from './InputBoard'
import { useOpenBoard } from '../../context/BoardContext'

type BoardItemProps = {
  board: Board
}

const BoardItem: React.FunctionComponent<BoardItemProps> = ({ board }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeBoard, setActiveBoard } = useOpenBoard();
  const [isEdit, setIsEdit] = useState(false);

  const OnSelectContextMenu = (option: ContextMenuOption) => {
    if (option.label === 'Edit') {
      setIsEdit(true)
    } else if (option.label === 'Delete') {
      dispatch(deleteBoard(board.id)).then((data) => {
        if (data.payload.success === true) {
          setActiveBoard(null);
        }
      });
    }
  }
  const contextMenuOptions = [
    { label: 'Edit', icon: <EditIcon /> },
    { label: 'Delete', icon: <DeleteIcon /> },
  ]

  const openBoard = () => {
    setActiveBoard(board.id);
  }

  if (isEdit) {
    return <InputBoard board={board} isEdit={true} onClosed={() => setIsEdit(false)} bg={activeBoard?.id === board.id ? 'bg-gray-200' : ''}/>
  } else {
    return (
      <div className={`p-[10px_15px] flex justify-between items-center gap-[10px] ${activeBoard?.id === board.id ? 'bg-gray-200' : ''}`}>
        <span onClick={openBoard} className="text-[20px] font-medium cursor-pointer flex-1 truncate">
          {board.name}
        </span>
        <div className="flex items-center justify-center p-[3px]">
          <ContextMenu options={contextMenuOptions} onSelect={OnSelectContextMenu} />
        </div>
      </div>
    )
  }
}

export default BoardItem