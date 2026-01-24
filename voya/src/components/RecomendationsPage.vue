<template>
  <div class="recommendations-page">
    <!-- Navbar -->
    <nav class="navbar">
      <a class="navbar-logo" @click.prevent="showLogoutModal = true" style="cursor: pointer">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </a>
      <div class="navbar-links">
        <router-link to="/homepage" active-class="active">Home</router-link>
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
              <div v-if="!destination.imageLoaded" class="trip-cover-loading">
                <div class="loading-spinner"></div>
              </div>
              <img
                :src="destination.imageUrl || '/src/img/mountains.png'"
                :alt="destination.city || destination.country"
                :class="{ loaded: destination.imageLoaded }"
                @load="onImageLoad(destination)"
                @error="onImageError(destination)"
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

  <!-- Logout Confirmation Modal -->
  <Teleport to="body">
    <Transition name="logout-modal">
      <div
        v-if="showLogoutModal"
        class="logout-modal-overlay"
        @click.self="showLogoutModal = false"
      >
        <div class="logout-modal">
          <h3>End Session?</h3>
          <p>Are you sure you want to log out?</p>
          <div class="logout-modal-buttons">
            <button class="btn-no" @click="showLogoutModal = false">No</button>
            <button class="btn-yes" @click="confirmLogout">Yes</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'
import { useSelectionsStore } from '../stores/selections'
import { fetchCountryWikipediaSummary } from '../api/countries'
import { getAvailableInterests } from '../api/api'

const router = useRouter()

const API_BASE = 'http://localhost:3001'

const auth = useAuthStore()
const interestsStore = useInterestsStore()
const selections = useSelectionsStore()
const allDestinations = ref([])
const selectedFilters = ref([])
const isLoading = ref(false)

// Logout modal state
const showLogoutModal = ref(false)

function confirmLogout() {
  auth.logout()
  router.push('/')
}

const availableInterests = ref([])

async function loadAvailableInterestsFromAPI() {
  const interests = await getAvailableInterests()
  availableInterests.value = interests.map((i) => i.name) || []
}

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
        dest.imageLoaded = false
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

function onImageLoad(destination) {
  destination.imageLoaded = true
}

function onImageError(destination) {
  destination.imageLoaded = true
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
    await loadAvailableInterestsFromAPI()
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
