import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RenderTaskHistoryEntry from './RenderTaskHistoryEntry';
import { getTaskHistory } from '../../../redux/history/history.api';
import { AppDispatch, ReducerStates } from '../../../redux/store';
import { HistoryEntry } from '../../../redux/history/types';

const TaskHistory: React.FunctionComponent<{ id: number }> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const stateTaskHistory = useSelector((state: ReducerStates) => state.taskHistory);
  console.log(stateTaskHistory.history);
  

  useEffect(() => {
    dispatch(getTaskHistory(id));
  }, [id])

  return (
    <div className="body-activity flex flex-col gap-[25px] flex-1 max-w-[545px] max-h-full overflow-y-auto bg-gray-200 px-[30px] py-[45px] max-lg:p-[25px] max-[960px]:max-w-full max-[960px]:max-h-none max-[960px]:overflow-y-visible">
      <div className="font-bold text-[24px]">Activity</div>
      <ul className='flex flex-col text-gray-500 gap-[15px]'>
        {stateTaskHistory.history.map((entry: HistoryEntry) => {
          return <RenderTaskHistoryEntry key={entry.id} entry={entry} />
        })}
      </ul>
    </div>
  )
}

export default TaskHistory