import axiosClient from './axiosClient'

export const getActivityLogs = async (params = {}, signal) => {
  const res = await axiosClient.get('/activity-logs', { params, signal })
  return { logs: res.data.data.logs, meta: res.data.meta }
}
