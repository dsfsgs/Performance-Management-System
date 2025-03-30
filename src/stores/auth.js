import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/login', { username, password })
        const { user, token } = response.data

        this.user = user
        this.token = token

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)

        return { success: true, role: user.role_id }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' }
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
