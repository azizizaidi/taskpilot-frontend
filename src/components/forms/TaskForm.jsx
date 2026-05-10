import { useEffect, useState } from 'react'
import Button from '../common/Button'
import ErrorMessage from '../common/ErrorMessage'
import LoadingSpinner from '../common/LoadingSpinner'
import { getProjects } from '../../api/projectApi'
import { getUsers } from '../../api/userApi'

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

const toInputDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return isNaN(d) ? '' : d.toISOString().slice(0, 10)
}

function TaskForm({ initialValues = {}, onSubmit, submitting, error, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    projectId: initialValues.projectId ?? initialValues.project?.id ?? '',
    assignedToId: initialValues.assignedToId ?? initialValues.assignedTo?.id ?? '',
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    status: initialValues.status ?? 'TODO',
    priority: initialValues.priority ?? 'MEDIUM',
    dueDate: toInputDate(initialValues.dueDate),
  })
  const [validationErrors, setValidationErrors] = useState({})

  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState(null)

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)

  useEffect(() => {
    getProjects({ limit: 100 })
      .then((data) => {
        const items = data?.items ?? (Array.isArray(data) ? data : [])
        setProjects(items)
      })
      .catch(() => setProjectsError('Could not load projects. Enter project ID manually.'))
      .finally(() => setProjectsLoading(false))

    getUsers({ limit: 100 })
      .then((data) => setUsers(data.items || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false))
  }, [])

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.projectId && form.projectId !== 0) errs.projectId = 'Project is required'
    if (!STATUS_OPTIONS.includes(form.status)) errs.status = 'Invalid status'
    if (!PRIORITY_OPTIONS.includes(form.priority)) errs.priority = 'Invalid priority'
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
    const payload = {
      projectId: Number(form.projectId),
      assignedToId: form.assignedToId ? Number(form.assignedToId) : undefined,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    }
    onSubmit(payload)
  }

  const selectCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={error} />

      {/* Project */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project <span className="text-red-500">*</span>
        </label>
        {projectsLoading ? (
          <div className="py-2"><LoadingSpinner /></div>
        ) : projectsError ? (
          <>
            <p className="text-xs text-amber-600 mb-1">{projectsError}</p>
            <input
              type="number"
              value={form.projectId}
              onChange={(e) => set('projectId', e.target.value)}
              disabled={submitting}
              className={inputCls}
              placeholder="Project ID"
              min="1"
            />
          </>
        ) : (
          <select
            value={form.projectId}
            onChange={(e) => set('projectId', e.target.value)}
            disabled={submitting}
            className={selectCls}
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}
        {validationErrors.projectId && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.projectId}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          disabled={submitting}
          className={inputCls}
          placeholder="Task title"
        />
        {validationErrors.title && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.title}</p>
        )}
      </div>

      {/* Description */}
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

      {/* Status + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            disabled={submitting}
            className={selectCls}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
            disabled={submitting}
            className={selectCls}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assigned To + Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          {usersLoading ? (
            <div className="py-2"><LoadingSpinner /></div>
          ) : (
            <select
              value={form.assignedToId}
              onChange={(e) => set('assignedToId', e.target.value)}
              disabled={submitting}
              className={selectCls}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            disabled={submitting}
            className={inputCls}
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

export default TaskForm
