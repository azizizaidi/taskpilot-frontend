import { useState } from 'react'
import Button from '../common/Button'

function CommentForm({ onSubmit, submitLabel = 'Add Comment', initialContent = '', onCancel }) {
  const [content, setContent] = useState(initialContent)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Comment cannot be empty.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setError(Object.values(data.errors).filter(Boolean).join(' '))
      } else {
        setError(data?.message || 'Failed to submit comment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Write a comment…"
        disabled={submitting}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default CommentForm
