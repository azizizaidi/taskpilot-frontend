import { formatDate } from '../../utils/formatDate'

const statusStyles = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-amber-100 text-amber-700',
  DONE: 'bg-green-100 text-green-700',
}

const priorityStyles = {
  LOW: 'bg-gray-100 text-gray-500',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  URGENT: 'bg-red-100 text-red-600',
}

const statusLabel = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
}

function Badge({ text, className }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {text}
    </span>
  )
}

function UpcomingTaskList({ tasks = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Tasks</h3>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No upcoming tasks.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="border border-gray-100 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge
                  text={statusLabel[task.status] ?? task.status}
                  className={statusStyles[task.status] ?? 'bg-gray-100 text-gray-600'}
                />
                <Badge
                  text={task.priority}
                  className={priorityStyles[task.priority] ?? 'bg-gray-100 text-gray-500'}
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-400">
                {task.dueDate && (
                  <span>Due: <span className="text-gray-600">{formatDate(task.dueDate)}</span></span>
                )}
                {task.project?.title && (
                  <span>Project: <span className="text-gray-600">{task.project.title}</span></span>
                )}
                {task.assignedTo?.name && (
                  <span>Assignee: <span className="text-gray-600">{task.assignedTo.name}</span></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UpcomingTaskList
