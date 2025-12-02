<template>
  <div class="container">
    <div class="left-panel"></div>

    <div class="login-card register-mode">
      <img src="/src/img/Vector.png" alt="Decorative flight vector" class="vector-art" />
      <img src="/src/img/logo.svg" alt="Voya Logo" class="login-logo" />
      <p class="auth-title">Create an account</p>

      <label>Email</label>
      <input type="email" v-model="email" placeholder="youremailhere@gmail.com" />

      <label>Password</label>
      <input type="password" v-model="password" placeholder="•••••••" />

      <label>Confirm password</label>
      <input type="password" v-model="confirmPassword" placeholder="•••••••" />

      <label>Username</label>
      <input type="text" v-model="username" placeholder="username" />

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button class="login-btn" @click="submit">Continue</button>

      <p class="register">Already have an account? <router-link to="/login"><span>Login</span></router-link></p>

      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const errorMessage = ref('')

function submit() {
  errorMessage.value = ''
  
  if (!email.value) {
    errorMessage.value = 'Escreve um email'
    return
  }
  
  if (!password.value) {
    errorMessage.value = 'Escreve uma password'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As passwords não coincidem'
    return
  }
  
  if (!username.value) {
    errorMessage.value = 'Escreve um username'
    return
  }

  try {
    auth.register(email.value, password.value, username.value)
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    username.value = ''
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<style src="../style.css"></style>
