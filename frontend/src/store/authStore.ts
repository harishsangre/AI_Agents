import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../lib/axios'

interface User {
  id: string
  googleId?: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (googleToken: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (googleToken: string) => {
        try {
          const response = await axios.post('/auth/google', {
            token: googleToken,
          })
          const { user, access_token } = response.data
          localStorage.setItem('token', access_token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          set({
            user,
            isAuthenticated: true,
            token: access_token,
          })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      },
      logout: async () => {
        try {
          await axios.post('/auth/logout')
        } catch (error) {
          console.error('Logout failed:', error)
        } finally {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          set({
            user: null,
            isAuthenticated: false,
            token: null,
          })
        }
      },
      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            set({ isAuthenticated: false })
            return
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/auth/me')
          set({
            user: response.data,
            isAuthenticated: true,
            token,
          })
        } catch (error) {
          localStorage.removeItem('token')
          set({
            user: null,
            isAuthenticated: false,
            token: null,
          })
        }
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)