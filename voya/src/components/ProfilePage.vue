<template>
  <div class="profile-container">
    <!-- Background with image -->
    <div class="profile-wrapper">
      <!-- Back button -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>

      <!-- Profile Card -->
      <div class="profile-card">
        <img src="/src/img/Vector.png" alt="Decorative flight vector" class="vector-art-profile" />
        
        <!-- User Avatar -->
        <div class="avatar-container">
          <div class="avatar">
            <span class="avatar-letter">{{ userInitial }}</span>
          </div>
        </div>

        <!-- User Info -->
        <h2 class="profile-username">{{ user?.username || 'User' }}</h2>
        <p class="profile-email">{{ user?.email || '' }}</p>

        <!-- Stats -->
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-number">{{ tripCount }}</span>
            <span class="stat-label">Viagens</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ interestsCount }}</span>
            <span class="stat-label">Interesses</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="profile-progress">
          <div class="progress-header">
            <span>Progresso</span>
            <span>{{ tripCount }}/10 viagens</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="profile-actions">
          <button class="action-btn edit-btn" @click="editProfile">
            Editar Perfil
          </button>
          <button class="action-btn logout-btn" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()

const user = computed(() => auth.user)

const userInitial = computed(() => {
  if (user.value?.username) {
    return user.value.username.charAt(0).toUpperCase()
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const tripCount = computed(() => selections.count || 0)

const interestsCount = computed(() => {
  // For now, return a placeholder - can be connected to actual interests store later
  return 0
})

const progressPercentage = computed(() => {
  return (tripCount.value % 10) * 10
})

function goBack() {
  router.push('/destinations')
}

function editProfile() {
  // TODO: Implement edit profile functionality
  alert('Funcionalidade em desenvolvimento')
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style src="../css/ProfilePage.css"></style>
