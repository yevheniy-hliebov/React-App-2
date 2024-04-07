import { useEffect } from 'react'
import BoardContent from './components/board-content/BoardContent'
import SideBar from './components/sidebar/SideBar'
import { BoardProvider } from './context/BoardContext'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './redux/store'
import { getPriorities } from './redux/priority/priority.api'

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getPriorities());
  }, [])
  
  return (
    <BoardProvider>
      <div className='w-screen h-screen overflow-hidden flex bg-gray-50 max-[800px]:flex-col'>
        <SideBar />
        <BoardContent />
      </div>
    </BoardProvider>
  )
}

export default App
