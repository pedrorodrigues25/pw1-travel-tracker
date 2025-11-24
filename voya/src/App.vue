<template>
  <div>
    <div v-if="!isLogged" class="container">
      <div class="left-panel"></div>

      <div class="login-card">
        <h2>Login to your account</h2>

        <label>Email</label>
        <input type="email" v-model="email" placeholder="youremailhere@gmail.com" />

        <label>Password</label>
        <input type="password" v-model="password" />

        <button class="login-btn" @click="submit">Login</button>

        <p class="register">Don’t have an account? <span>Register Now</span></p>

        <div class="divider">OR</div>

        <div class="social-row">
          <div class="social-btn">G</div>
          <div class="social-btn">f</div>
          <div class="social-btn"></div>
        </div>
      </div>
    </div>

    <div v-else>
      <Destinations />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Destinations from './components/Destinations.vue'
import { useSelectionsStore } from './stores/selections'

const auth = useAuthStore()

const email = ref('')
const password = ref('')

const isLogged = computed(() => !!(auth.user && auth.user.email))

function submit() {
  if (!email.value) return alert('Escreve um email')
  const normalized = email.value.trim().toLowerCase()
  auth.login(normalized)
  // garantir que as selections do utilizador são carregadas imediatamente
  const selections = useSelectionsStore()
  selections.load(normalized)
  email.value = ''
  password.value = ''
}
</script>

<style src="./style.css"></style>
