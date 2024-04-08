import React from 'react'
import BoardHeader from './BoardHeader'
import { useOpenBoard } from '../../context/BoardContext';
import BoardLists from './BoardLists';
import { ListFormProvider } from '../../context/ListFormContext';
import ListForm from '../popups/ListForm';
import { ListDeleteFormProvider } from '../../context/ListDeleteFormContext';
import ListDeleteForm from '../popups/ListDeleteForm';

const BoardContent: React.FunctionComponent = () => {
  const { activeBoard } = useOpenBoard();

  if (activeBoard) {
    return (
      <div className='w-full max-h-screen flex flex-col overflow-hidden px-[35px] max-[600px]:px-[15px]'>
        <ListFormProvider>
          <ListDeleteFormProvider>
            <BoardHeader />
            <BoardLists />

            {/* Form for creating or editing list */}
            <ListForm />
            {/* Form for deleting list and moving task to another list*/}
            <ListDeleteForm />
          </ListDeleteFormProvider>
        </ListFormProvider>
      </div>
    )
  } else {
    return;
  }
}

export default BoardContent