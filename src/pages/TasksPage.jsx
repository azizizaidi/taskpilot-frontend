import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import useAuth from '../hooks/useAuth'
import { getTasks, updateTask, deleteTask } from '../api/taskApi'
import { getProjects } from '../api/projectApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import ConfirmDialog from '../components/common/ConfirmDialog'
import KanbanColumn from '../components/tasks/KanbanColumn'
import TaskCard from '../components/cards/TaskCard'
import Button from '../components/common/Button'

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const COLUMN_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

function groupTasksByStatus(tasks) {
  const groups = {}
  COLUMN_STATUSES.forEach((s) => { groups[s] = [] })
  tasks.forEach((task) => {
    if (groups[task.status] !== undefined) groups[task.status].push(task)
  })
  return groups
}
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']
const SORT_BY_OPTIONS = [
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
]

function TasksPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)

  const [projects, setProjects] = useState([])

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [activeTask, setActiveTask] = useState(null)
  const [savingTaskId, setSavingTaskId] = useState(null)
  const [dragError, setDragError] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    getProjects({ limit: 100 })
      .then((data) => {
        const items = data?.items ?? (Array.isArray(data) ? data : [])
        setProjects(items)
      })
      .catch(() => {})
  }, [])

  const fetchTasks = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = { page, limit: 10, sortBy, sortOrder }
    if (search) params.search = search
    if (status) params.status = status
    if (priority) params.priority = priority
    if (projectFilter) params.projectId = Number(projectFilter)

    getTasks(params)
      .then((data) => {
        const items = data?.items ?? (Array.isArray(data) ? data : [])
        setTasks(items)
        setPagination(data?.pagination ?? null)
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load tasks.'))
      .finally(() => setLoading(false))
  }, [page, search, status, priority, projectFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

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
    deleteTask(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        fetchTasks()
      })
      .catch((err) => {
        const code = err.response?.status
        if (code === 403) {
          setDeleteError('You do not have permission to delete this task.')
        } else if (code === 404) {
          setDeleteError('Task not found.')
        } else {
          setDeleteError(err.response?.data?.message || 'Failed to delete task.')
        }
        setDeleteTarget(null)
      })
      .finally(() => setDeleting(false))
  }

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over) return
    const newStatus = over.id
    const task = tasks.find((t) => t.id === active.id)
    if (!task || task.status === newStatus) return

    setDragError(null)
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: newStatus } : t))
    setSavingTaskId(task.id)

    updateTask(task.id, { status: newStatus })
      .catch((err) => {
        fetchTasks()
        const code = err.response?.status
        if (code === 403) {
          setDragError('You do not have permission to update this task.')
        } else {
          setDragError(err.response?.data?.message || 'Failed to update task status.')
        }
      })
      .finally(() => setSavingTaskId(null))
  }

  const selectCls = 'border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">Browse and manage tasks across all projects.</p>
        </div>
        {isAdmin && (
          <Link to="/tasks/new">
            <Button>Create Task</Button>
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
            placeholder="Search tasks…"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        <select
          value={status}
          onChange={handleFilterChange(setStatus)}
          className={selectCls}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={handleFilterChange(setPriority)}
          className={selectCls}
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {projects.length > 0 && (
          <select
            value={projectFilter}
            onChange={handleFilterChange(setProjectFilter)}
            className={selectCls}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}

        <select
          value={sortBy}
          onChange={handleFilterChange(setSortBy)}
          className={selectCls}
        >
          {SORT_BY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>Sort: {label}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={handleFilterChange(setSortOrder)}
          className={selectCls}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : tasks.length === 0 ? (
        <EmptyState
          message={
            search || status || priority || projectFilter
              ? 'No tasks match your filters.'
              : 'No tasks yet. Create your first task!'
          }
        />
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">
            Drag tasks between columns to update status.
          </p>

          {dragError && (
            <div className="mb-4">
              <ErrorMessage message={dragError} />
            </div>
          )}

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUMN_STATUSES.map((s) => (
                <KanbanColumn
                  key={s}
                  status={s}
                  tasks={groupTasksByStatus(tasks)[s]}
                  isAdmin={isAdmin}
                  userId={user?.id}
                  onDelete={setDeleteTarget}
                  savingTaskId={savingTaskId}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeTask ? (
                <div className="rotate-1 shadow-2xl">
                  <TaskCard
                    task={activeTask}
                    isAdmin={isAdmin}
                    isAssigned={activeTask.assignedTo?.id === user?.id}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

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
          message={`Delete task "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteTarget(null); setDeleteError(null) }}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default TasksPage
