<template>
  <div class="container">
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

      <p class="register">Don't have an account? <router-link to="/register"><span>Register Now</span></router-link></p>


      
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

  try {
    auth.login(email.value, password.value)

    const selections = useSelectionsStore()
    selections.load(email.value.trim().toLowerCase())

    email.value = ''
    password.value = ''

    router.push('/destinations')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>


<style src="../style.css"></style>
