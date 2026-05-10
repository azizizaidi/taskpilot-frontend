import axiosClient from './axiosClient'

export const getTasks = async (params = {}) => {
  const res = await axiosClient.get('/tasks', { params })
  return res.data.data
}

export const getTaskById = async (id) => {
  const res = await axiosClient.get(`/tasks/${id}`)
  return res.data.data.task
}

export const createTask = async (payload) => {
  const res = await axiosClient.post('/tasks', payload)
  return res.data.data.task
}

export const updateTask = async (id, payload) => {
  const res = await axiosClient.put(`/tasks/${id}`, payload)
  return res.data.data.task
}

export const deleteTask = async (id) => {
  await axiosClient.delete(`/tasks/${id}`)
}
