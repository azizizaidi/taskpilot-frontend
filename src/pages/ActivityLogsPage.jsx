import { useEffect, useState } from 'react'
import { getActivityLogs } from '../api/activityLogApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import { formatDateTime } from '../utils/formatDate'

const LIMIT_OPTIONS = [10, 25, 50]

function ActivityLogsPage() {
  const [logs, setLogs] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    setForbidden(false)
    getActivityLogs({ page, limit, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }, controller.signal)
      .then(({ logs: data, meta: pagination }) => {
        setLogs(data || [])
        setMeta(pagination || null)
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return
        if (err.response?.status === 403) {
          setForbidden(true)
        } else {
          setError(err.response?.data?.message || 'Failed to load activity logs.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [page, limit, dateFrom, dateTo])

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value)
    setPage(1)
  }

  const handleDateToChange = (e) => {
    setDateTo(e.target.value)
    setPage(1)
  }

  const handleClearDates = () => {
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  if (loading) return <LoadingSpinner />

  if (forbidden) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Logs</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          You do not have permission to view activity logs.
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Logs</h2>
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Activity Logs</h2>
        <div className="flex items-center gap-4">
          {meta && (
            <span className="text-xs text-gray-400">{meta.total} total</span>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="limit-select" className="text-xs text-gray-500">Per page</label>
            <select
              id="limit-select"
              value={limit}
              onChange={handleLimitChange}
              className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            max={dateTo || undefined}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={handleDateToChange}
            min={dateFrom || undefined}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={handleClearDates}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Clear
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <EmptyState message="No activity logs recorded yet." />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      {log.user && (
                        <span className="text-xs text-gray-500">
                          {log.user.name || log.user.email}
                        </span>
                      )}
                    </div>
                    {log.description && (
                      <p className="text-sm text-gray-700 mb-1">{log.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                      {log.project && (
                        <span>Project: <span className="text-gray-600">{log.project.title}</span></span>
                      )}
                      {log.task && (
                        <span>Task: <span className="text-gray-600">{log.task.title}</span></span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ActivityLogsPage
