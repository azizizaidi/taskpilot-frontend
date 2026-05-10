import { useState } from 'react'
import Button from '../common/Button'
import ConfirmDialog from '../common/ConfirmDialog'
import CommentForm from './CommentForm'
import { formatDateTime } from '../../utils/formatDate'

function CommentItem({ comment, currentUserId, isAdmin, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = comment.user?.id === currentUserId
  const canEdit = isOwner
  const canDelete = isOwner || isAdmin

  const handleEdit = async (content) => {
    await onEdit(comment.id, content)
    setEditing(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(comment.id)
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">
              {comment.user?.name || comment.user?.email || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-gray-400 italic">(edited)</span>
            )}
          </div>

          {editing ? (
            <CommentForm
              initialContent={comment.comment || ''}
              submitLabel="Save"
              onSubmit={handleEdit}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {comment.comment || ''}
            </p>
          )}
        </div>

        {!editing && (canEdit || canDelete) && (
          <div className="flex gap-1 flex-shrink-0">
            {canEdit && (
              <Button variant="secondary" className="!px-2 !py-1 text-xs" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {deleteOpen && (
        <ConfirmDialog
          message="Delete this comment? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default CommentItem
