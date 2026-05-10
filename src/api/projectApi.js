import axiosClient from './axiosClient'

export const getProjects = async (params = {}) => {
  const res = await axiosClient.get('/projects', { params })
  return res.data.data
}

export const getProjectById = async (id) => {
  const res = await axiosClient.get(`/projects/${id}`)
  return res.data.data.project
}

export const createProject = async (payload) => {
  const res = await axiosClient.post('/projects', payload)
  return res.data.data.project
}

export const updateProject = async (id, payload) => {
  const res = await axiosClient.put(`/projects/${id}`, payload)
  return res.data.data.project
}

export const deleteProject = async (id) => {
  await axiosClient.delete(`/projects/${id}`)
}
