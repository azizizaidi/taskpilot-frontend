import axiosClient from './axiosClient'

export const getUsers = async (params = {}) => {
  const res = await axiosClient.get('/users', { params })
  return res.data.data
}
