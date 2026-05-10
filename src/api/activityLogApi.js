import axiosClient from './axiosClient'

export const getActivityLogs = async ({ page = 1, limit = 10, dateFrom, dateTo } = {}, signal) => {
  const params = { page, limit }
  if (dateFrom) params.dateFrom = dateFrom
  if (dateTo) params.dateTo = dateTo
  const res = await axiosClient.get('/activity-logs', { params, signal })
  return { logs: res.data.data.logs, meta: res.data.meta }
}
