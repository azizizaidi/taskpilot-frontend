import axiosClient from './axiosClient'

export const getTaskComments = async (taskId) => {
  const res = await axiosClient.get(`/tasks/${taskId}/comments`)
  return res.data.data.comments
}

export const createTaskComment = async (taskId, payload) => {
  const res = await axiosClient.post(`/tasks/${taskId}/comments`, payload)
  return res.data.data.comment
}

export const updateComment = async (commentId, payload) => {
  const res = await axiosClient.put(`/comments/${commentId}`, payload)
  return res.data.data.comment
}

export const deleteComment = async (commentId) => {
  await axiosClient.delete(`/comments/${commentId}`)
}
