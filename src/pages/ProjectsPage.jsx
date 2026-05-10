import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getProjects, deleteProject } from '../api/projectApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ProjectCard from '../components/cards/ProjectCard'
import Button from '../components/common/Button'

const STATUS_OPTIONS = ['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']
const SORT_BY_OPTIONS = [
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
]

function ProjectsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [projects, setProjects] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const fetchProjects = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = { page, limit: 10, sortBy, sortOrder }
    if (search) params.search = search
    if (status) params.status = status
    if (priority) params.priority = priority

    getProjects(params)
      .then((data) => {
        const items = data?.items ?? (Array.isArray(data) ? data : [])
        setProjects(items)
        setPagination(data?.pagination ?? null)
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [page, search, status, priority, sortBy, sortOrder])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    deleteProject(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        fetchProjects()
      })
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) {
          setDeleteError('You do not have permission to delete this project.')
        } else if (code === 404) {
          setDeleteError('Project not found.')
        } else {
          setDeleteError(err.response?.data?.message || 'Failed to delete project.')
        }
        setDeleteTarget(null)
      })
      .finally(() => setDeleting(false))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and browse your projects.</p>
        </div>
        {isAdmin && (
          <Link to="/projects/new">
            <Button>Create Project</Button>
          </Link>
        )}
      </div>

      {deleteError && (
        <div className="mb-4">
          <ErrorMessage message={deleteError} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-56">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search projects…"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        <select
          value={status}
          onChange={handleFilterChange(setStatus)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={handleFilterChange(setPriority)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={handleFilterChange(setSortBy)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_BY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>Sort: {label}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={handleFilterChange(setSortOrder)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : projects.length === 0 ? (
        <EmptyState message={search || status || priority ? 'No projects match your filters.' : 'No projects yet. Create your first project!'} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteTarget(null); setDeleteError(null) }}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default ProjectsPage
