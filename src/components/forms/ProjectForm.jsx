import { useState } from 'react'
import Button from '../common/Button'
import ErrorMessage from '../common/ErrorMessage'

const STATUS_OPTIONS = ['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

const toInputDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return isNaN(d) ? '' : d.toISOString().slice(0, 10)
}

function ProjectForm({ initialValues = {}, onSubmit, submitting, error, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    status: initialValues.status ?? 'PLANNING',
    priority: initialValues.priority ?? 'MEDIUM',
    startDate: toInputDate(initialValues.startDate),
    dueDate: toInputDate(initialValues.dueDate),
  })
  const [validationErrors, setValidationErrors] = useState({})

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!STATUS_OPTIONS.includes(form.status)) errs.status = 'Invalid status'
    if (!PRIORITY_OPTIONS.includes(form.priority)) errs.priority = 'Invalid priority'
    if (form.startDate && isNaN(new Date(form.startDate))) errs.startDate = 'Invalid start date'
    if (form.dueDate && isNaN(new Date(form.dueDate))) errs.dueDate = 'Invalid due date'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      startDate: form.startDate || undefined,
      dueDate: form.dueDate || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={error} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          disabled={submitting}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          placeholder="Project title"
        />
        {validationErrors.title && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          disabled={submitting}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-50"
          placeholder="Optional description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {validationErrors.status && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.status}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {validationErrors.priority && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.priority}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          {validationErrors.startDate && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          {validationErrors.dueDate && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
