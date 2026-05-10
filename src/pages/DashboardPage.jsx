import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { getDashboardStats } from '../api/dashboardApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/cards/StatCard'
import RecentActivityList from '../components/dashboard/RecentActivityList'
import UpcomingTaskList from '../components/dashboard/UpcomingTaskList'

function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="pt-4">
      <ErrorMessage message={error} />
    </div>
  )

  const summary = stats?.summary ?? {}
  const recentActivities = stats?.recentActivities ?? []
  const upcomingTasks = stats?.upcomingTasks ?? []

  const isAdmin = user?.role === 'ADMIN'

  const projectSub = [
    { label: 'Active', value: summary.activeProjects ?? 0 },
    { label: 'Done', value: summary.completedProjects ?? 0 },
  ]
  if (isAdmin) {
    projectSub.push({ label: 'Archived', value: summary.archivedProjects ?? 0 })
  }

  const taskSub = [
    { label: 'In Progress', value: summary.inProgressTasks ?? 0 },
    { label: 'Review', value: summary.reviewTasks ?? 0 },
    { label: 'Done', value: summary.completedTasks ?? 0 },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name ?? 'there'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening in your workspace.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Projects"
          value={summary.totalProjects ?? 0}
          sub={projectSub}
        />
        <StatCard
          label="Total Tasks"
          value={summary.totalTasks ?? 0}
          sub={taskSub}
        />
        {isAdmin ? (
          <>
            <StatCard
              label="Team Members"
              value={summary.totalUsers ?? 0}
            />
            <StatCard
              label="Total Comments"
              value={summary.totalComments ?? 0}
            />
          </>
        ) : (
          <>
            <StatCard
              label="Assigned to Me"
              value={summary.assignedTasks ?? 0}
            />
            <StatCard
              label="To Do"
              value={summary.todoTasks ?? 0}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityList activities={recentActivities} />
        <UpcomingTaskList tasks={upcomingTasks} />
      </div>
    </div>
  )
}

export default DashboardPage
