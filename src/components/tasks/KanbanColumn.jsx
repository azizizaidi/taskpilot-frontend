import { useDroppable, useDraggable } from '@dnd-kit/core'
import TaskCard from '../cards/TaskCard'

const COLUMN_STYLES = {
  TODO:        { label: 'To Do',       dot: 'bg-gray-400',   header: 'bg-gray-50 border-gray-200' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-blue-500',   header: 'bg-blue-50 border-blue-200' },
  REVIEW:      { label: 'Review',      dot: 'bg-yellow-500', header: 'bg-yellow-50 border-yellow-200' },
  DONE:        { label: 'Done',        dot: 'bg-green-500',  header: 'bg-green-50 border-green-200' },
}

function DraggableTaskCard({ task, isAdmin, userId, onDelete, isSaving }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-20' : ''}`}
    >
      <TaskCard
        task={task}
        isAdmin={isAdmin}
        isAssigned={task.assignedTo?.id === userId}
        onDelete={onDelete}
      />
      {isSaving && (
        <p className="text-xs text-center text-gray-400 mt-1 animate-pulse">Saving…</p>
      )}
    </div>
  )
}

function KanbanColumn({ status, tasks, isAdmin, userId, onDelete, savingTaskId }) {
  const { label, dot, header } = COLUMN_STYLES[status] ?? {
    label: status,
    dot: 'bg-gray-400',
    header: 'bg-gray-50 border-gray-200',
  }

  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col">
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-lg border border-b-0 ${header}`}>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="ml-auto text-xs font-medium text-gray-400">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 p-3 rounded-b-lg border min-h-28 flex-1 transition-colors ${
          isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center pt-4">No tasks in this status</p>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              isAdmin={isAdmin}
              userId={userId}
              onDelete={onDelete}
              isSaving={savingTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default KanbanColumn
