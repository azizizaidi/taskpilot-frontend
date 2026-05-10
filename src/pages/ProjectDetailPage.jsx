import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getProjectById, deleteProject } from '../api/projectApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { formatDate } from '../utils/formatDate'

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProjectById(id)
      .then(setProject)
      .catch((err) => {
        const code = err.response?.status
        if (code === 404) {
          setError('Project not found.')
        } else if (code === 403) {
          setError('You do not have access to this project.')
        } else {
          setError(err.response?.data?.message || 'Failed to load project.')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = () => {
    setDeleting(true)
    setDeleteError(null)
    deleteProject(id)
      .then(() => navigate('/projects'))
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) {
          setDeleteError('You do not have permission to delete this project.')
        } else if (code === 404) {
          setDeleteError('Project not found.')
        } else {
          setDeleteError(err.response?.data?.message || 'Failed to delete project.')
        }
        setDeleteOpen(false)
      })
      .finally(() => setDeleting(false))
  }

  if (loading) return <LoadingSpinner />

  if (error || !project) {
    return (
      <div>
        <Link to="/projects" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to Projects
        </Link>
        <ErrorMessage message={error || 'Project not found.'} />
      </div>
    )
  }

  const members = project.members ?? []
  const taskCount = project._count?.tasks ?? 0

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Link to="/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Link to={`/projects/${project.id}/edit`}>
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
          <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
          <div className="flex gap-2 flex-shrink-0">
            <Badge label={project.status} />
            <Badge label={project.priority} />
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Owner</span>
            <p className="text-gray-800 mt-0.5 font-medium">{project.owner?.name ?? '—'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Tasks</span>
            <p className="text-gray-800 mt-0.5 font-medium">{taskCount}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Members</span>
            <p className="text-gray-800 mt-0.5 font-medium">{members.length}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Start Date</span>
            <p className="text-gray-800 mt-0.5">{formatDate(project.startDate)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Due Date</span>
            <p className="text-gray-800 mt-0.5">{formatDate(project.dueDate)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide">Created</span>
            <p className="text-gray-800 mt-0.5">{formatDate(project.createdAt)}</p>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wide block mb-2">
              Team Members
            </span>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <span
                  key={m.user?.id ?? m.userId}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                >
                  {m.user?.name ?? 'Unknown'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {deleteOpen && (
        <ConfirmDialog
          message={`Delete project "${project.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default ProjectDetailPage
