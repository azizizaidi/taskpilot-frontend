import axiosClient from './axiosClient'

export const loginUser = async (credentials) => {
  const res = await axiosClient.post('/auth/login', credentials)
  return res.data.data
}

export const registerUser = async (payload) => {
  const res = await axiosClient.post('/auth/register', payload)
  return res.data.data
}

export const getCurrentUser = async () => {
  const res = await axiosClient.get('/auth/me')
  return res.data.data
}
