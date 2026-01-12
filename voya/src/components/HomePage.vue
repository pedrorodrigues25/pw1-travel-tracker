<template>
  <div class="trips">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </router-link>
      <div class="navbar-links">
        <router-link to="/homepage" active-class="active">Home</router-link>
        <router-link to="/recommendations" active-class="active">Recommendations</router-link>
        <router-link to="/trips" active-class="active">Trips</router-link>
        <router-link to="/friends" active-class="active">Friends</router-link>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>
  </div>

  <div class="home-container">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1 class="welcome-title">
        Welcome back, <span class="username">{{ user?.username || 'User' }}</span>
      </h1>
    </div>

    <!-- User Profile Card -->
    <div class="user-profile-card">
      <div class="profile-left">
        <div class="profile-avatar">
          <div class="avatar-placeholder">{{ user?.username?.charAt(0).toUpperCase() || 'U' }}</div>
        </div>
      </div>
      <div class="profile-center">
        <h3 class="profile-name">{{ user?.username || 'Nome utilizador' }}</h3>
        <p class="profile-interests-label">See all your achievements</p>
        <div class="profile-interests">
          <span
            v-for="(interest, idx) in userInterests.slice(0, 5)"
            :key="idx"
            class="interest-badge"
          >
            {{ interest }}
          </span>
        </div>
      </div>
      <div class="profile-right">
        <div class="trips-counter">
          <p class="counter-text">{{ selections.count }}/10 viagens</p>
        </div>
        <router-link to="/profile" class="see-profile-btn">SEE PROFILE</router-link>
      </div>
    </div>

    <div class="badges-section">
      <h2>SEE YOUR TRIPS</h2>
      <div class="badges-grid">
        <!-- YOUR LAST TRIP (última concluída) -->
        <div
          class="badges-card your-badges has-bg clickable"
          :style="
            lastCompletedTrip?.imageUrl
              ? { backgroundImage: `url(${lastCompletedTrip.imageUrl})` }
              : {}
          "
          @click="lastCompletedTrip && goToJournal(lastCompletedTrip.id)"
        >
          <div class="badge-label">YOUR LAST TRIP</div>
          <div class="badge-list">
            <div v-if="lastCompletedTrip" class="badge-trip">
              <h4 class="trip-title">
                <template v-if="lastCompletedTrip.city"
                  >{{ lastCompletedTrip.city }}, {{ lastCompletedTrip.destination }}</template
                >
                <template v-else>{{ lastCompletedTrip.destination }}</template>
              </h4>
              <p class="badge-trip-dates">{{ formatTripDates(lastCompletedTrip) }}</p>
            </div>
            <p v-else class="empty-message">No completed trips yet</p>
          </div>
        </div>
        <!-- NEXT TRIPS (próximas upcoming) -->
        <div
          class="badges-card badges-to-unlock has-bg clickable"
          :style="
            upcomingTrips[0]?.imageUrl
              ? { backgroundImage: `url(${upcomingTrips[0].imageUrl})` }
              : {}
          "
          @click="upcomingTrips[0] && goToJournal(upcomingTrips[0].id)"
        >
          <div class="badge-label">NEXT TRIPS</div>
          <div class="badge-list">
            <div v-if="upcomingTrips.length" class="badge-trip">
              <div
                v-for="trip in upcomingTrips.slice(0, 3)"
                :key="trip.id"
                class="upcoming-trip-item clickable"
                @click="goToJournal(trip.id)"
              >
                <h4 class="trip-title">
                  <template v-if="trip.city">{{ trip.city }}, {{ trip.destination }}</template>
                  <template v-else>{{ trip.destination }}</template>
                </h4>
                <p class="badge-trip-dates">{{ formatTripDates(trip) }}</p>
              </div>
            </div>
            <p v-else class="empty-message">No upcoming trips yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Badges Section -->
    <div class="badges-section">
      <h2>BADGES</h2>
      <div class="badges-grid">
        <div class="badges-card your-badges clickable">
          <div class="badge-label">YOUR BADGES</div>
          <div class="badge-list">
            <p class="empty-message">Badges will appear here</p>
          </div>
        </div>
        <div class="badges-card badges-to-unlock clickable">
          <div class="badge-label">BADGES TO UNLOCK</div>
          <div class="badge-list">
            <p class="empty-message">Locked badges will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'
import { getFriends } from '../api/api'
import '../css/HomePage.css'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()

function goToJournal(tripId) {
  if (tripId) router.push({ name: 'Journal', params: { tripId } })
}

const user = auth.user
const userInterests = ref([])
const allFriends = ref([])

// Última viagem concluída (ordenada por endDate/startDate/createdAt desc)
const lastCompletedTrip = computed(() => {
  const trips = (selections.items || []).filter((t) => t && t.status === 'completed' && !t.archived)
  if (!trips.length) return null
  const toTime = (t) => {
    const raw = t.endDate || t.startDate || t.createdAt
    const d = raw ? new Date(raw) : new Date(0)
    return Number.isNaN(d.getTime()) ? 0 : d.getTime()
  }
  return trips.slice().sort((a, b) => toTime(b) - toTime(a))[0]
})

// Próximas viagens (upcoming) ordenadas por startDate asc
const upcomingTrips = computed(() => {
  const trips = (selections.items || []).filter((t) => t && t.status === 'upcoming' && !t.archived)
  const toTime = (t) => {
    const raw = t.startDate || t.createdAt
    const d = raw ? new Date(raw) : new Date(0)
    return Number.isNaN(d.getTime()) ? 0 : d.getTime()
  }
  return trips.slice().sort((a, b) => toTime(a) - toTime(b))
})

// Formata datas de uma viagem
function formatTripDates(trip) {
  if (!trip) return ''
  const fmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const start = trip.startDate ? new Date(trip.startDate) : null
  const end = trip.endDate ? new Date(trip.endDate) : null
  const startOk = start && !Number.isNaN(start.getTime())
  const endOk = end && !Number.isNaN(end.getTime())
  if (startOk && endOk) return `${fmt.format(start)} – ${fmt.format(end)}`
  if (endOk) return fmt.format(end)
  if (startOk) return fmt.format(start)
  if (trip.createdAt) {
    const created = new Date(trip.createdAt)
    if (!Number.isNaN(created.getTime())) return fmt.format(created)
  }
  return ''
}

async function loadUserData() {
  if (user && user.email) {
    await selections.load(user.email)
    await interestsStore.load(user.email)
    userInterests.value = interestsStore.items.map((item) => item.interest)

    // Load all friends
    try {
      allFriends.value = await getFriends()
    } catch (e) {
      console.error('Error loading friends:', e)
    }
  }
}

function ensureLoaded() {
  if (user && user.email) loadUserData()
}

ensureLoaded()

watch(
  () => auth.user && auth.user.email,
  (val) => {
    if (val) loadUserData()
  },
)
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/HomePage.css"></style>
