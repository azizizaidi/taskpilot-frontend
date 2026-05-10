import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProjectById, createProject, updateProject } from '../api/projectApi'
import ProjectForm from '../components/forms/ProjectForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [initial, setInitial] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loadingProject, setLoadingProject] = useState(isEdit)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    setLoadingProject(true)
    getProjectById(id)
      .then(setInitial)
      .catch((err) => setLoadError(err.response?.data?.message || 'Failed to load project.'))
      .finally(() => setLoadingProject(false))
  }, [id, isEdit])

  const handleSubmit = (payload) => {
    setSubmitting(true)
    setSubmitError(null)

    const action = isEdit ? updateProject(id, payload) : createProject(payload)

    action
      .then((project) => {
        if (isEdit) {
          navigate(`/projects/${id}`)
        } else {
          navigate(project?.id ? `/projects/${project.id}` : '/projects')
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
          setSubmitError(data?.message || 'Failed to save project.')
        }
      })
      .finally(() => setSubmitting(false))
  }

  if (loadingProject) return <LoadingSpinner />

  if (loadError) {
    return (
      <div>
        <Link to="/projects" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to Projects
        </Link>
        <ErrorMessage message={loadError} />
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link to="/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          {isEdit ? 'Edit Project' : 'Create Project'}
        </h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          initialValues={initial ?? {}}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
          submitLabel={isEdit ? 'Save Changes' : 'Create Project'}
        />
      </div>
    </div>
  )
}

export default ProjectFormPage
