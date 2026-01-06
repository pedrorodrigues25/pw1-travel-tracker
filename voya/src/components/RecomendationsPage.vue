<template>
  <div class="recommendations-page">
    <!-- Navbar -->
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

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-container">
        <button 
          v-for="interest in availableInterests" 
          :key="interest"
          :class="['filter-tag', { active: selectedFilters.includes(interest) }]"
          @click="toggleFilter(interest)"
        >
          <span class="filter-icon">{{ selectedFilters.includes(interest) ? '✕' : '+' }}</span>
          {{ interest }}
        </button>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="recommendations-content">
      <h2 class="section-title">TRIPS JUST FOR YOU</h2>
      
      <div class="recommendations-grid">
        <div 
          v-for="destination in filteredRecommendations" 
          :key="destination.id"
          class="recommendation-card"
        >
          <div class="card-image" :style="{ backgroundImage: `url(${destination.photo || 'https://via.placeholder.com/400x300'})` }">
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ destination.city }}, {{ destination.country }}</h3>
            <p class="card-description">{{ destination.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }}</p>
            <button class="card-button">
              <span class="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredRecommendations.length === 0" class="no-recommendations">
        <p>No recommendations available for your selected interests</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'

const auth = useAuthStore()
const interestsStore = useInterestsStore()
const recommendations = ref([])
const selectedFilters = ref([])

const availableInterests = [
  'Traveling with Friends',
  'Solo Adventure',
  'Family Trips',
  'Beach & Relaxation',
  'City Exploration',
  'Nature & Hiking',
  'Cultural Experiences',
  'Food & Gastronomy',
  'Photography',
  'Road Trips'
]

async function loadUserInterests() {
  const userEmail = auth.user?.email
  if (userEmail) {
    await interestsStore.load(userEmail)
    // Extrair apenas os nomes dos interesses
    selectedFilters.value = interestsStore.items.map(item => item.interest)
  }
}

async function loadRecommendations() {
  try {
    const userEmail = auth.user?.email
    const response = await fetch(userEmail ? `/api/recommendations?userEmail=${encodeURIComponent(userEmail)}` : '/api/recommendations')
    if (response.ok) {
      recommendations.value = await response.json()
    }
  } catch (e) {
    console.error('Erro ao carregar recomendações:', e)
  }
}

const filteredRecommendations = computed(() => {
  if (selectedFilters.value.length === 0) {
    return recommendations.value
  }
  return recommendations.value.filter(dest =>
    dest.tags && dest.tags.some(tag => selectedFilters.value.includes(tag))
  )
})

function toggleFilter(interest) {
  const index = selectedFilters.value.indexOf(interest)
  if (index === -1) {
    selectedFilters.value.push(interest)
  } else {
    selectedFilters.value.splice(index, 1)
  }
}

onMounted(async () => {
  await loadUserInterests()
  await loadRecommendations()
})
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/RecomendationsPage.css"></style>