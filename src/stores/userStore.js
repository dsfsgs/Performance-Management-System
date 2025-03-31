
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    role: (state) => {
      if (!state.user) return null

      const roleMap = {
        3: 'hr-admin',
        1: 'office-admin',
        2: 'planning-admin'
      }
      return roleMap[state.user.role_id] || null
    }
  },
  actions: {
async loadUser() {
  const userData = localStorage.getItem('user')
  if (!userData) return

  this.user = JSON.parse(userData)
  const token = localStorage.getItem('token')

  if (token) {
    try {
      const response = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      this.user = response.data
    } catch (error) {
      console.error('User not found, logging out:', error)
      this.clearUser()
    }
  }
},
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token') // Ensure token is removed
    },
    async logout(router) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token not found')

        await api.post('/user_logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        this.clearUser()
        router.push('/login')
      } catch (error) {
        console.error('Error during logout:', error)
        // Even if API call fails, still clear user data and redirect
        this.clearUser()
        if (router) router.push('/login')
      }
    }
  }
})
