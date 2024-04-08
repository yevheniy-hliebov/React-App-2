import { useDispatch } from "react-redux";
import { List } from "../../../redux/list/types";
import ContextMenu, { ContextMenuOption } from "../../ContextMenu";
import { AddIcon, DeleteIcon, EditIcon } from "../../icons";
import { AppDispatch } from "../../../redux/store";
import { useListForm } from "../../../context/ListFormContext";
import { useOpenBoard } from "../../../context/BoardContext";
import { useListDeleteForm } from "../../../context/ListDeleteFormContext";
import { deleteList } from "../../../redux/list/list.api";
import { useTaskForm } from "../../../context/TaskFormContext";

type HeaderTaskListProps = {
  list: List;
  count_tasks?: number
};

function HeaderList({ list, count_tasks }: HeaderTaskListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { activeBoard } = useOpenBoard();

  const { openListForm } = useListForm();
  const { openListDeleteForm } = useListDeleteForm();
  const { openTaskForm } = useTaskForm();

  const OnSelectContextMenu = (option: ContextMenuOption) => {
    if (option.label === 'Edit') {
      openListForm({ title: 'Rename list', boardId: activeBoard?.id, list: list, isEditForm: true })
    } else if (option.label === 'Add new card') {
      openTaskForm({ boardId: list.board_id, listId: list.id });
    } else if (option.label === 'Delete') {
      if (list.tasks && list.tasks.length > 0) {
        openListDeleteForm(list.board_id, list);
      } else {
        dispatch(deleteList({ boardId: list.board_id, listId: list.id }))
      }
    }
  }

  const contextMenuOptions = [
    { label: 'Edit', icon: <EditIcon /> },
    { label: 'Add new card', icon: <AddIcon /> },
    { label: 'Delete', icon: <DeleteIcon /> },
  ]

  return (
    <div className='tasklist__header-title h-[50px] border-y-[2px] border-y-gray-200 flex items-center justify-between leading-6'>
      <div className="text-[20px]">{list.name}</div>
      <div className="flex items-center">
        <span className="text-[18px]">{count_tasks}</span>
        <ContextMenu options={contextMenuOptions} onSelect={OnSelectContextMenu} />
      </div>
    </div>
  )
}

export default HeaderList