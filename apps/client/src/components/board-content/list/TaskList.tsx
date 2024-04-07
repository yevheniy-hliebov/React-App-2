import { List } from '../../../redux/list/types';
import { Task } from '../../../redux/task/types';
import TaskCard from './TaskCard'

type TaskListProps = {
  list: List;
  className?: string;
}

function TaskList({ list, className = '' }: TaskListProps) {
  return (
    <div className={'tasklist shrink-0 w-[300px] ' + className}>
      <div key={'listcards' + list.id} className="tasklist__list grid gap-[22px] pr-[25px]">
        {list.tasks?.map((task: Task) => {
          return <TaskCard key={task.id} task={task} />
        })}
      </div>
    </div>
  )
}

export default TaskList