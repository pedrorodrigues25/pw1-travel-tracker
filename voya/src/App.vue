<template>
  <div>
    <div v-if="!isLogged" class="container">
      <div class="left-panel"></div>

      <div class="login-card">
        <img src="/src/img/Vector.png" alt="Decorative flight vector" class="vector-art" />
        <img src="/src/img/logo.svg" alt="Voya Logo" style="width: 20%" />
        <p style="font-size: 20px; color: #014f76">Login to your account</p>

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
import Destinations from './components/DestinationsList.vue'
import { useSelectionsStore } from './stores/selections'

const auth = useAuthStore()

const email = ref('')
const password = ref('')

const isLogged = computed(() => !!(auth.user && auth.user.email))

function submit() {
  if (!email.value) return alert('Escreve um email')
  const normalized = email.value.trim().toLowerCase()
  auth.login(normalized)
  const selections = useSelectionsStore()
  selections.load(normalized)
  email.value = ''
  password.value = ''
}
</script>

<style src="./style.css"></style>
