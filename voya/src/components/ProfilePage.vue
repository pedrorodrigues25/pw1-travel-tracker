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

        <!-- Interests -->
        <div class="profile-interests" v-if="userInterests.length > 0">
          <h3 class="interests-heading">Os meus interesses</h3>
          <div class="interests-list">
            <span v-for="interest in userInterests" :key="interest" class="interest-chip">
              {{ interest }}
            </span>
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()

// Load interests on mount
onMounted(() => {
  if (auth.user?.email) {
    interestsStore.load(auth.user.email)
  }
})

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
  return interestsStore.items.length
})

const userInterests = computed(() => {
  return interestsStore.items
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
