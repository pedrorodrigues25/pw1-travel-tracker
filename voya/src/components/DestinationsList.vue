<template>
  <div class="trips">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </router-link>
      <div class="navbar-links">
        <router-link to="/destinations" active-class="active">Home</router-link>
        <router-link to="/recommendations" active-class="active">Recommendations</router-link>
        <router-link to="/trips" active-class="active">Trips</router-link>
        <router-link to="/friends" active-class="active">Friends</router-link>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>
  </div>
  <div class="home-progress">
    <h2 style="margin-top: 18px">Welcome to Voya!</h2>
    <div class="progress-container" style="width: 300px; margin: 32px auto 0 auto">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <div class="progress-text" style="text-align: center; margin-top: 8px">
      {{ selections.count }}/10 trips
    </div>
    <!-- Aqui podes adicionar conquistas do user -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import '../css/DestinationsList.css'

const auth = useAuthStore()
const selections = useSelectionsStore()

const user = auth.user

// Compute the progress percentage (0-100%)
const progressPercentage = ref(0)

watch(
  () => selections.count,
  (count) => {
    progressPercentage.value = (count % 10) * 10
  },
  { immediate: true },
)

function ensureLoaded() {
  if (user && user.email) selections.load(user.email)
}

ensureLoaded()

watch(
  () => auth.user && auth.user.email,
  (val) => {
    if (val) selections.load(val)
  },
)

// save on unload (just in case)
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/DestinationsList.css"></style>
