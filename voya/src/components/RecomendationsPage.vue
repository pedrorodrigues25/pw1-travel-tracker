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
      <h2 class="voya-section-title">TRIPS JUST FOR YOU</h2>

      <div v-if="isLoading" class="loading-state" aria-live="polite">
        <div class="loading-spinner" aria-hidden="true"></div>
        <p class="loading-text">Loading recommendations...</p>
      </div>

      <template v-else>
        <div class="cards-container">
          <div
            v-for="destination in filteredRecommendations"
            :key="destination.id"
            class="trip-card"
          >
            <div class="trip-cover clickable" @click="goToDestination(destination.id)">
              <img
                :src="destination.imageUrl || '/src/img/mountains.png'"
                :alt="destination.city || destination.country"
              />
            </div>
            <div class="trip-info">
              <div class="trip-title-row">
                <h4 class="trip-title">
                  <template v-if="destination.city"
                    >{{ destination.city }}, {{ destination.country }}</template
                  >
                  <template v-else>{{ destination.country }}</template>
                </h4>
                <span class="trip-status pill upcoming">Recommended</span>
              </div>
              <div class="trip-updates">Matches your interests</div>
              <div class="trip-avatars">
                <span class="avatar tiny" v-for="n in 3" :key="n"></span>
              </div>
            </div>
            <div class="trip-actions">
              <button class="open-journal-btn pill" @click="goToDestination(destination.id)">
                See Trip
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredRecommendations.length === 0" class="no-recommendations">
          <p>No recommendations available for your selected interests</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'
import { useSelectionsStore } from '../stores/selections'
import { fetchCountryWikipediaSummary } from '../api/countries'

const router = useRouter()

const API_BASE = 'http://localhost:3001'

const auth = useAuthStore()
const interestsStore = useInterestsStore()
const selections = useSelectionsStore()
const allDestinations = ref([])
const selectedFilters = ref([])
const isLoading = ref(false)

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
  'Road Trips',
]

async function loadUserInterests() {
  const userEmail = auth.user?.email
  if (userEmail) {
    await interestsStore.load(userEmail)
    // Extrair apenas os nomes dos interesses
    selectedFilters.value = interestsStore.items.map((item) => item.interest)
  }
}

async function loadDestinations() {
  try {
    // Buscar todos os destinos do json-server
    const res = await fetch(`${API_BASE}/destinations`)
    if (res.ok) {
      const dests = await res.json()
      // Fetch Wikipedia image for each destination
      for (const dest of dests) {
        try {
          const wiki = await fetchCountryWikipediaSummary(dest.city || dest.country)
          dest.imageUrl = wiki?.originalimage?.source || ''
        } catch {}
      }
      allDestinations.value = dests
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
  return allDestinations.value.filter(
    (dest) => dest.tags && dest.tags.some((tag) => selectedFilters.value.includes(tag)),
  )
})

// Retorna apenas as tags que estão selecionadas nos filtros
function getMatchingTags(tags) {
  if (!tags) return []
  return tags.filter((tag) => selectedFilters.value.includes(tag))
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

async function addToTrips(dest) {
  if (auth.isGuest) {
    alert('Please log in to save trips.')
    return
  }
  const userEmail = auth.user?.email
  if (!userEmail) {
    alert('Please log in first')
    return
  }
  await selections.add(
    {
      destination: dest.country,
      city: dest.city || '',
      notes: '',
      status: 'upcoming',
      startDate: '',
      endDate: '',
      imageUrl: dest.imageUrl || '',
    },
    userEmail,
  )
}

onMounted(async () => {
  isLoading.value = true
  try {
    await loadUserInterests()
    await loadDestinations()
  } finally {
    isLoading.value = false
  }
})
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/RecomendationsPage.css"></style>
<style src="../css/Trips.css"></style>
