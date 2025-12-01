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

      <button class="login-btn" @click="submit">Continue</button>

      <p class="register">Already have an account? <router-link to="/login"><span>Login</span></router-link></p>

      <div class="divider">OR</div>

      <div class="social-row">
        <div class="social-btn">G</div>
        <div class="social-btn">f</div>
        <div class="social-btn"></div>
      </div>
      <p class="Disable">Not Working for now!!</p>
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

function submit() {
  if (!email.value) return alert('Escreve um email')
  if (!password.value) return alert('Escreve uma password')
  if (password.value !== confirmPassword.value) return alert('As passwords não coincidem')
  if (!username.value) return alert('Escreve um username')

  const normalized = email.value.trim().toLowerCase()
  auth.login(normalized)
  router.push('/login')
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  username.value = ''
}
</script>

<style src="../style.css"></style>
