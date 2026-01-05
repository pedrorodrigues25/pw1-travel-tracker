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
<style scoped>
.country-search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
}
.country-suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-height: 180px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 350px;
  min-width: 220px;
}
.country-suggestions li {
  padding: 7px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.country-suggestions li:hover {
  background: #f0f4fa;
}
.country-flag {
  width: 22px;
  height: 16px;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: 0 1px 2px #0001;
}
.city-search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
}
.city-suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-height: 180px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 350px;
  min-width: 220px;
}
.city-suggestions li {
  padding: 7px 12px;
  cursor: pointer;
}
.city-suggestions li:hover {
  background: #f0f4fa;
}
select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
  background: #fff;
  color: #222;
}
</style>
