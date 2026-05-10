import { formatDateTime } from '../../utils/formatDate'

function RecentActivityList({ activities = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No recent activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-700 leading-snug">
                  {activity.description}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-gray-400">
                  {activity.user?.name && <span>{activity.user.name}</span>}
                  {activity.project?.title && (
                    <span className="truncate">· {activity.project.title}</span>
                  )}
                  {activity.task?.title && (
                    <span className="truncate">· {activity.task.title}</span>
                  )}
                  <span>· {formatDateTime(activity.createdAt)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RecentActivityList
