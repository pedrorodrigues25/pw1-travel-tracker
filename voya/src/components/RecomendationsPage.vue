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
      
      <div class="cards-container">
        <div 
          v-for="destination in filteredRecommendations" 
          :key="destination.id"
          class="trip-card"
        >
          <div class="card-image clickable" @click="goToDestination(destination.id)">
            <img :src="destination.photo || '/src/img/placeholder.jpg'" alt="Destination image" />
          </div>
          <div class="card-content">
            <div class="card-row card-title-row">
              <span class="card-title">{{ destination.city }}, {{ destination.country }}</span>
            </div>
            <div class="card-row card-tags-row">
              <span 
                v-for="tag in getMatchingTags(destination.tags)" 
                :key="tag" 
                class="card-tag"
              >{{ tag }}</span>
            </div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'

const router = useRouter()

const API_BASE = 'http://localhost:3001'

const auth = useAuthStore()
const interestsStore = useInterestsStore()
const allDestinations = ref([])
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

async function loadDestinations() {
  try {
    // Buscar todos os destinos do json-server
    const res = await fetch(`${API_BASE}/destinations`)
    if (res.ok) {
      allDestinations.value = await res.json()
    }
  } catch (e) {
    console.error('Erro ao carregar destinos:', e)
  }
}

// Filtrar destinos localmente com base nos filtros selecionados na UI
const filteredRecommendations = computed(() => {
  if (selectedFilters.value.length === 0) {
    return [] // Se não há filtros selecionados, não mostra nenhum destino
  }
  return allDestinations.value.filter(dest =>
    dest.tags && dest.tags.some(tag => selectedFilters.value.includes(tag))
  )
})

// Retorna apenas as tags que estão selecionadas nos filtros
function getMatchingTags(tags) {
  if (!tags) return []
  return tags.filter(tag => selectedFilters.value.includes(tag))
}

function toggleFilter(interest) {
  const index = selectedFilters.value.indexOf(interest)
  if (index === -1) {
    selectedFilters.value.push(interest)
  } else {
    selectedFilters.value.splice(index, 1)
  }
}

function goToDestination(destinationId) {
  router.push(`/destination/${destinationId}`)
}

onMounted(async () => {
  await loadUserInterests()
  await loadDestinations()
})
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/RecomendationsPage.css"></style>