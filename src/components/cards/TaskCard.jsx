import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatDate } from '../../utils/formatDate'

function TaskCard({ task, isAdmin, isAssigned, onDelete }) {
  const canEdit = isAdmin
  const canDelete = isAdmin

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/tasks/${task.id}`}
          className="text-base font-semibold text-gray-800 hover:text-blue-600 leading-snug"
        >
          {task.title}
        </Link>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge label={task.status} />
          <Badge label={task.priority} />
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {task.project?.title && <span>Project: {task.project.title}</span>}
        {task.assignedTo?.name && <span>Assigned: {task.assignedTo.name}</span>}
        {!task.assignedTo && <span className="italic">Unassigned</span>}
        {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
      </div>

      <div className="flex gap-2 pt-1">
        <Link to={`/tasks/${task.id}`}>
          <Button variant="secondary" className="text-xs px-3 py-1.5">
            View
          </Button>
        </Link>
        {canEdit && (
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="secondary" className="text-xs px-3 py-1.5">
              Edit
            </Button>
          </Link>
        )}
        {!canEdit && isAssigned && (
          <Link to={`/tasks/${task.id}`}>
            <Button variant="secondary" className="text-xs px-3 py-1.5">
              Update Status
            </Button>
          </Link>
        )}
        {canDelete && (
          <Button
            variant="danger"
            className="text-xs px-3 py-1.5 ml-auto"
            onClick={() => onDelete(task)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}

export default TaskCard
