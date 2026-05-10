import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getTaskById, createTask, updateTask } from '../api/taskApi'
import TaskForm from '../components/forms/TaskForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

function TaskFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [initial, setInitial] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loadingTask, setLoadingTask] = useState(isEdit)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    setLoadingTask(true)
    getTaskById(id)
      .then(setInitial)
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) setLoadError('You do not have permission to edit this task.')
        else if (code === 404) setLoadError('Task not found.')
        else setLoadError(err.response?.data?.message || 'Failed to load task.')
      })
      .finally(() => setLoadingTask(false))
  }, [id, isEdit])

  const handleSubmit = (payload) => {
    setSubmitting(true)
    setSubmitError(null)

    const action = isEdit ? updateTask(id, payload) : createTask(payload)

    action
      .then((task) => {
        if (isEdit) {
          navigate(`/tasks/${id}`)
        } else {
          navigate(task?.id ? `/tasks/${task.id}` : '/tasks')
        }
      })
      .catch((err) => {
        const data = err.response?.data
        if (data?.errors && typeof data.errors === 'object') {
          const msgs = Object.values(data.errors).filter(Boolean).join(' ')
          setSubmitError(msgs || 'Validation failed.')
        } else if (err.response?.status === 403) {
          setSubmitError('You do not have permission to perform this action.')
        } else {
          setSubmitError(data?.message || 'Failed to save task.')
        }
      })
      .finally(() => setSubmitting(false))
  }

  if (loadingTask) return <LoadingSpinner />

  if (loadError) {
    return (
      <div>
        <Link to="/tasks" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to Tasks
        </Link>
        <ErrorMessage message={loadError} />
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
          ← Back to Tasks
        </Link>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          {isEdit ? 'Edit Task' : 'Create Task'}
        </h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <TaskForm
          initialValues={initial ?? {}}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
          submitLabel={isEdit ? 'Save Changes' : 'Create Task'}
        />
      </div>
    </div>
  )
}

export default TaskFormPage
