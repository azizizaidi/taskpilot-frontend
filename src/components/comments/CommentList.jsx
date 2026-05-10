import CommentItem from './CommentItem'
import EmptyState from '../common/EmptyState'

function CommentList({ comments, currentUserId, isAdmin, onEdit, onDelete }) {
  if (!comments || comments.length === 0) {
    return <EmptyState message="No comments yet. Be the first to comment." />
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CommentList
