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
      <img 
        src="/src/img/logo.svg" 
        alt="Voya Logo" 
        class="login-logo clickable-logo" 
        @click="goToLanding"
      />
      <p class="auth-title">Login to your account</p>

      <label>Email</label>
      <input type="text" v-model="email" placeholder="youremailhere@gmail.com or admin" />

      <label>Password</label>
      <input type="password" v-model="password" />

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <button class="login-btn" @click="submit">Login</button>

      <p class="register">
        Don't have an account? <router-link to="/register"><span>Register Now</span></router-link>
      </p>
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

function goToLanding() {
  router.push('/')
}

const email = ref('')
const password = ref('')
const errorMessage = ref('')

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

  try {
    let userEmail = email.value.trim().toLowerCase()
    
    // Convert "admin" to "admin@gmail.com"
    if (userEmail === 'admin') {
      userEmail = 'admin@gmail.com'
    }
    
    await auth.login(userEmail, password.value)

    const selections = useSelectionsStore()
    await selections.load(userEmail)

    // Check if it's admin login
    const isAdmin = userEmail === 'admin@gmail.com'

    email.value = ''
    password.value = ''

    // Redirecionar baseado no tipo de utilizador
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/homepage')
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<style src="../style.css"></style>
<style src="../css/AdminPage.css"></style>
<style src="../css/LoginForm.css"></style>
