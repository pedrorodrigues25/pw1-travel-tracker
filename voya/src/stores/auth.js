import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'voya_current_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) user.value = JSON.parse(raw)
    } catch (e) {
      console.error('failed to load auth from storage', e)
    }
  }

  function login(email) {
    user.value = { email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  load()

  return { user, login, logout }
})
