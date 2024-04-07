import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RenderHistoryEntry from './RenderHistoryEntry'
import { CloseIcon, ReloadIcon } from '../../icons'
import { AppDispatch, ReducerStates } from '../../../redux/store'
import { getBoardHistory } from '../../../redux/history/history.api'
import { useOpenBoard } from '../../../context/BoardContext'
import Button from '../../form-elements/Button'
import { HistoryEntry } from '../../../redux/history/types'

const BoardHistory: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeBoard } = useOpenBoard();

  const [isOpenHistory, setisOpenHistory] = useState(false)
  const stateHistory = useSelector((state: ReducerStates) => state.boardHistory);

  useEffect(() => {
    if (isOpenHistory === true && activeBoard) {
      dispatch(getBoardHistory(activeBoard.id));
    }
  }, [isOpenHistory])

  const handleCloseHistory = () => {
    setisOpenHistory(false);
  }
  const handleOpenHistory = () => {
    setisOpenHistory(true);
  }

  return (
    <div>
      <Button onClick={handleOpenHistory} icon={ReloadIcon} variant='border'>History</Button>
      <div className={`history-popup fixed z-50 inset-0 bg-black bg-opacity-25 ${isOpenHistory ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'} transition-all`}>
        <div className="history-popup__window absolute top-0 right-0 bg-white w-full max-w-[420px] h-screen flex flex-col">
          <div className="history-window__app-row w-full flex items-center justify-between p-[20px] bg-gray-500">
            <div className="history-window__app-title text-gray-50 text-[20px] select-none">
              History
            </div>
            <CloseIcon onClick={handleCloseHistory} className='text-gray-300 size-[33px] cursor-pointer hover:text-gray-50 active:scale-[0.9] transition-all' />
          </div>
          <div className="history-window__body p-[20px] flex-1 overflow-y-auto bg-gray-200">
            <ul className='flex flex-col text-gray-500 gap-[25px]'>
              {stateHistory.history.map((entry: HistoryEntry) => {
                return <RenderHistoryEntry key={entry.id} entry={entry} />
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardHistory