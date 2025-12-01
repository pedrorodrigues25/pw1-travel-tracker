import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'voya_current_user'
const USERS_STORAGE_KEY = 'voya_users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const users = ref([])

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY)
      if (raw) users.value = JSON.parse(raw)
    } catch (e) {
      console.error('failed to load users from storage', e)
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) user.value = JSON.parse(raw)
    } catch (e) {
      console.error('failed to load auth from storage', e)
    }
  }

  function saveUsers() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users.value))
  }

  function register(email, password, username) {
    const normalizedEmail = email.trim().toLowerCase()
    
    // Verificar se o email já existe
    if (users.value.some(u => u.email === normalizedEmail)) {
      throw new Error('Email já registado')
    }

    // Verificar se o username já existe
    if (users.value.some(u => u.username === username)) {
      throw new Error('Username já existe')
    }

    // Criar novo utilizador
    const newUser = { email: normalizedEmail, password, username }
    users.value.push(newUser)
    saveUsers()
    return newUser
  }

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase()
    const foundUser = users.value.find(u => u.email === normalizedEmail)

    if (!foundUser) {
      throw new Error('Email não registado')
    }

    if (foundUser.password !== password) {
      throw new Error('Password incorreta')
    }

    user.value = { email: foundUser.email, username: foundUser.username }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    return user.value
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  loadUsers()
  load()

  return { user, users, register, login, logout }
})

