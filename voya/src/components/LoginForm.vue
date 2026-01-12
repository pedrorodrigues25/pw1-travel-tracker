<template>
  <div class="container">
    <div class="register-quote" aria-hidden="true">
      <h3 class="quote-title">travel</h3>
      <p class="quote-sub">
        is the only purchase that enriches<br />you in ways beyond material wealth
      </p>
    </div>
    <div class="left-panel"></div>

    <div class="login-card">
      <img src="/src/img/Vector.png" alt="Decorative flight vector" class="vector-art" />
      <img src="/src/img/logo.svg" alt="Voya Logo" class="login-logo" />
      <p class="auth-title">Login to your account</p>

      <label>Email</label>
      <input type="email" v-model="email" placeholder="youremailhere@gmail.com" />

      <label>Password</label>
      <input type="password" v-model="password" />

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button class="login-btn" @click="submit">Login</button>

      <button class="admin-login-btn" @click="showAdminModal = true">Admin Login</button>

      <p class="register">
        Don't have an account? <router-link to="/register"><span>Register Now</span></router-link>
      </p>
    </div>

    <!-- Admin Login Modal -->
    <div v-if="showAdminModal" class="modal-overlay" @click.self="showAdminModal = false">
      <div class="admin-modal">
        <button class="modal-close" @click="showAdminModal = false">×</button>
        <h3>Admin Login</h3>
        <p class="modal-description">Enter admin credentials</p>

        <label>Email</label>
        <input
          v-model="adminEmail"
          type="email"
          placeholder="admin@gmail.com"
          class="admin-input"
        />

        <label>Password</label>
        <input
          v-model="adminPassword"
          type="password"
          placeholder="Enter password"
          class="admin-input"
        />

        <div v-if="adminErrorMessage" class="error-message">{{ adminErrorMessage }}</div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showAdminModal = false">Cancel</button>
          <button class="btn-login-admin" @click="confirmAdminLogin">Login as Admin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showAdminModal = ref(false)
const adminEmail = ref('')
const adminPassword = ref('')
const adminErrorMessage = ref('')

async function submit() {
  errorMessage.value = ''

  if (!email.value) {
    errorMessage.value = 'Escreve um email'
    return
  }

  if (!password.value) {
    errorMessage.value = 'Escreve uma password'
    return
  }

  // Prevent admin from using normal login
  if (email.value === 'admin@gmail.com') {
    errorMessage.value = 'Admin users must use Admin Login'
    return
  }

  try {
    await auth.login(email.value, password.value)

    const selections = useSelectionsStore()
    await selections.load(email.value.trim().toLowerCase())

    email.value = ''
    password.value = ''

    router.push('/destinations')
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function confirmAdminLogin() {
  adminErrorMessage.value = ''

  if (!adminEmail.value) {
    adminErrorMessage.value = 'Enter email'
    return
  }

  if (!adminPassword.value) {
    adminErrorMessage.value = 'Enter password'
    return
  }

  // Validate admin credentials
  if (adminEmail.value !== 'admin@gmail.com') {
    adminErrorMessage.value = 'Invalid admin email'
    return
  }

  if (adminPassword.value !== 'admin123') {
    adminErrorMessage.value = 'Invalid admin password'
    return
  }

  try {
    // Login com credenciais de admin
    await auth.login('admin@gmail.com', 'admin123')

    adminEmail.value = ''
    adminPassword.value = ''
    showAdminModal.value = false

    // Redirecionar para admin dashboard
    router.push('/admin')
  } catch (error) {
    adminErrorMessage.value = 'Admin login failed'
  }
}
</script>

<style src="../style.css"></style>
<style src="../css/AdminPage.css"></style>
<style src="../css/LoginForm.css"></style>
