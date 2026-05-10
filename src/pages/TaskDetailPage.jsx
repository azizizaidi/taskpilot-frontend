import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getTaskById, updateTask, deleteTask } from '../api/taskApi'
import { getTaskComments, createTaskComment, updateComment, deleteComment } from '../api/commentApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import CommentList from '../components/comments/CommentList'
import CommentForm from '../components/comments/CommentForm'
import { formatDate } from '../utils/formatDate'

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [statusUpdating, setStatusUpdating] = useState(false)
  const [statusError, setStatusError] = useState(null)

  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentsError, setCommentsError] = useState(null)

  const fetchComments = useCallback(() => {
    setCommentsLoading(true)
    setCommentsError(null)
    getTaskComments(id)
      .then(setComments)
      .catch((err) => {
        setCommentsError(err.response?.data?.message || 'Failed to load comments.')
      })
      .finally(() => setCommentsLoading(false))
  }, [id])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTaskById(id)
      .then(setTask)
      .catch((err) => {
        const code = err.response?.status
        if (code === 404) setError('Task not found.')
        else if (code === 403) setError('You do not have access to this task.')
        else setError(err.response?.data?.message || 'Failed to load task.')
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleAddComment = async (content) => {
    await createTaskComment(id, { comment: content })
    fetchComments()
  }

  const handleEditComment = async (commentId, content) => {
    await updateComment(commentId, { comment: content })
    fetchComments()
  }

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId)
    fetchComments()
  }

  const handleStatusChange = (newStatus) => {
    setStatusUpdating(true)
    setStatusError(null)
    updateTask(id, { status: newStatus })
      .then((updated) => setTask(updated))
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) setStatusError('You do not have permission to update this task.')
        else setStatusError(err.response?.data?.message || 'Failed to update status.')
      })
      .finally(() => setStatusUpdating(false))
  }

  const handleDelete = () => {
    setDeleting(true)
    setDeleteError(null)
    deleteTask(id)
      .then(() => navigate('/tasks'))
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) setDeleteError('You do not have permission to delete this task.')
        else if (code === 404) setDeleteError('Task not found.')
        else setDeleteError(err.response?.data?.message || 'Failed to delete task.')
        setDeleteOpen(false)
      })
      .finally(() => setDeleting(false))
  }

  if (loading) return <LoadingSpinner />

  if (error || !task) {
    return (
      <div>
        <Link to="/tasks" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to Tasks
        </Link>
        <ErrorMessage message={error || 'Task not found.'} />
      </div>
    )
  }

  const isAssigned = task.assignedTo?.id === user?.id
  const canUpdateStatus = isAdmin || isAssigned

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
          ← Back to Tasks
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Link to={`/tasks/${task.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {deleteError && (
        <div className="mb-4">
          <ErrorMessage message={deleteError} />
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
          <div className="flex gap-2 flex-shrink-0">
            <Badge label={task.status} />
            <Badge label={task.priority} />
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Project</span>
            {task.project ? (
              <Link
                to={`/projects/${task.project.id}`}
                className="block text-blue-600 hover:underline mt-0.5 font-medium"
              >
                {task.project.title}
              </Link>
            ) : (
              <p className="text-gray-800 mt-0.5">—</p>
            )}
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Assigned To</span>
            <p className="text-gray-800 mt-0.5 font-medium">
              {task.assignedTo?.name ?? <span className="italic text-gray-400">Unassigned</span>}
            </p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Created By</span>
            <p className="text-gray-800 mt-0.5 font-medium">{task.createdBy?.name ?? '—'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Due Date</span>
            <p className="text-gray-800 mt-0.5">{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Completed</span>
            <p className="text-gray-800 mt-0.5">{formatDate(task.completedAt)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Created</span>
            <p className="text-gray-800 mt-0.5">{formatDate(task.createdAt)}</p>
          </div>
        </div>

        {/* Status update */}
        {canUpdateStatus && (
          <div className="border-t pt-4">
            <span className="text-gray-400 text-xs uppercase tracking-wide block mb-2">
              Update Status
            </span>
            {statusError && (
              <div className="mb-2">
                <ErrorMessage message={statusError} />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || task.status === s}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    task.status === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
              {statusUpdating && (
                <span className="text-xs text-gray-400 self-center">Updating…</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Comments</h3>

        {commentsLoading ? (
          <LoadingSpinner />
        ) : commentsError ? (
          <ErrorMessage message={commentsError} />
        ) : (
          <CommentList
            comments={comments}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Add a comment</p>
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>

      {deleteOpen && (
        <ConfirmDialog
          message={`Delete task "${task.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default TaskDetailPage
