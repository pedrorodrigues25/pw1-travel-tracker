<template>
  <div class="trips">
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
  </div>

  <div class="home-container">
    <div class="welcome-section">
      <h1 class="welcome-title">
        Welcome back, <span class="username">{{ user?.username || 'User' }}</span>
      </h1>
    </div>

    <div class="user-profile-card">
      <div class="profile-left">
        <div class="profile-avatar">
          <img :src="avatarQuery" :alt="user?.username" class="avatar-img" />
        </div>
      </div>
      <div class="profile-center">
        <h3 class="profile-name">{{ user?.username || 'Nome utilizador' }}</h3>
        <br />
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
        <div class="trips-counter-container">
          <div class="counter-info">
            <span class="counter-text">{{ tripCount }}/{{ nextStep }} viagens</span>
          </div>
          <div class="home-progress-bar">
            <div class="home-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <router-link to="/profile" class="see-profile-btn">SEE PROFILE</router-link>
      </div>
    </div>

    <div class="badges-section">
      <h2>SEE YOUR TRIPS</h2>
      <div class="badges-grid">
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

    <div class="badges-section">
      <h2>BADGES</h2>
      <div class="badges-grid">
        <div class="badges-card your-badges">
          <div class="badge-label">YOUR BADGES</div>
          <div class="badge-list badges-earned-list">
            <div v-if="unlockedBadges.length" class="earned-badges-container">
              <div
                v-for="badge in unlockedBadges"
                :key="badge.id"
                class="earned-badge-item clickable"
                @click="openBadgeDetail(badge)"
              >
                <img :src="badge.imageUrl" :alt="badge.name" class="earned-badge-img" />
                <span class="earned-badge-name">{{ badge.name }}</span>
              </div>
            </div>
            <p v-else class="empty-message">Complete trips to earn badges!</p>
          </div>
        </div>

        <div class="badges-card badges-to-unlock">
          <div class="badge-label">BADGES TO UNLOCK</div>
          <div class="badge-list badges-locked-list">
            <div v-if="lockedBadges.length" class="locked-badges-container">
              <div v-for="badge in lockedBadges" :key="badge.id" class="locked-badge-item">
                <div class="locked-badge-info">
                  <img :src="badge.imageUrl" :alt="badge.name" class="locked-badge-img" />
                  <div class="locked-badge-details">
                    <span class="locked-badge-name">{{ badge.name }}</span>
                    <span class="locked-badge-req">
                      {{ badge.current }}/{{ badge.requirement }}
                      {{ badge.type === 'solo' ? 'solo trips' : 'trips with friends' }}
                    </span>
                  </div>
                </div>
                <div class="badge-progress-container">
                  <div class="badge-progress-bar" :style="{ width: badge.progress + '%' }"></div>
                </div>
              </div>
            </div>
            <p v-else class="empty-message">You've unlocked all badges!</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BadgeNotification
    :show="badgesStore.showNotification"
    :badge="badgesStore.newBadge"
    @close="badgesStore.closeNotification()"
  />

  <!-- Badge Detail Modal -->
  <Teleport to="body">
    <Transition name="badge-detail">
      <div v-if="showBadgeDetail" class="badge-detail-overlay" @click.self="closeBadgeDetail">
        <div class="badge-detail-modal">
          <button class="close-btn" @click="closeBadgeDetail">&times;</button>

          <div class="badge-detail-content">
            <div class="badge-detail-display">
              <img
                :src="selectedBadge?.imageUrl"
                :alt="selectedBadge?.name"
                class="badge-detail-image"
              />
            </div>

            <h3 class="badge-detail-name">{{ selectedBadge?.name }}</h3>
            <p class="badge-detail-description">{{ selectedBadge?.description }}</p>

            <div class="badge-detail-info">
              <div class="info-item">
                <span class="info-label">Earned on</span>
                <span class="info-value">{{ formatBadgeDate(selectedBadge?.earnedAt) }}</span>
              </div>
              <div v-if="selectedBadge?.associatedTrip" class="info-item">
                <span class="info-label">Trip</span>
                <span
                  class="info-value trip-link"
                  @click="goToTripFromBadge(selectedBadge.associatedTrip.id)"
                >
                  {{
                    selectedBadge.associatedTrip.city
                      ? `${selectedBadge.associatedTrip.city}, ${selectedBadge.associatedTrip.destination}`
                      : selectedBadge.associatedTrip.destination
                  }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Type</span>
                <span class="info-value">{{
                  selectedBadge?.id?.startsWith('friend') ? 'Trip with friends' : 'Solo trip'
                }}</span>
              </div>
            </div>

            <button class="badge-detail-btn" @click="closeBadgeDetail">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

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
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'
import { useBadgesStore } from '../stores/badges'
import { getFriends } from '../api/api'
import BadgeNotification from './BadgeNotification.vue'
import '../css/HomePage.css'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()
const badgesStore = useBadgesStore()

const user = auth.user
const userInterests = ref([])
const allFriends = ref([])

// Logout modal state
const showLogoutModal = ref(false)

function confirmLogout() {
  auth.logout()
  router.push('/')
}

// Badge detail modal state
const showBadgeDetail = ref(false)
const selectedBadge = ref(null)

// --- Lógica de Avatar ---
const avatarQuery = computed(() => {
  const seed = auth.user?.username || 'voya-user'
  return `https://api.dicebear.com/9.x/identicon/png?seed=${seed}&scale=70&backgroundColor=#ffffff`
})

// --- Lógica de Progresso (Mesma do Profile) ---
const tripCount = computed(() => selections.count || 0)

const nextStep = computed(() => {
  const c = tripCount.value || 0
  // Se for 0, o objetivo é 10. Se for 12, o objetivo é 20.
  return c === 0 ? 10 : Math.ceil((c + 0.1) / 10) * 10
})

const progressPercentage = computed(() => {
  const c = tripCount.value || 0
  const step = nextStep.value
  return Math.min(100, Math.round((c / step) * 100))
})

// --- Outros Computed ---
const unlockedBadges = computed(() => badgesStore.unlockedBadges)
const lockedBadges = computed(() => badgesStore.getLockedBadgesWithProgress(selections.items || []))

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

const upcomingTrips = computed(() => {
  const trips = (selections.items || []).filter((t) => t && t.status === 'upcoming' && !t.archived)
  const toTime = (t) => {
    const raw = t.startDate || t.createdAt
    const d = raw ? new Date(raw) : new Date(0)
    return Number.isNaN(d.getTime()) ? 0 : d.getTime()
  }
  return trips.slice().sort((a, b) => toTime(a) - toTime(b))
})

// --- Funções e Ciclo de Vida ---
function goToJournal(tripId) {
  if (tripId) router.push({ name: 'Journal', params: { tripId } })
}

function openBadgeDetail(badge) {
  selectedBadge.value = badge
  showBadgeDetail.value = true
}

function closeBadgeDetail() {
  showBadgeDetail.value = false
  selectedBadge.value = null
}

function goToTripFromBadge(tripId) {
  closeBadgeDetail()
  if (tripId) router.push({ name: 'Journal', params: { tripId } })
}

function formatBadgeDate(dateStr) {
  if (!dateStr) return 'Unknown'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

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
  return ''
}

async function loadUserData() {
  if (user && user.email) {
    await selections.load(user.email)
    await interestsStore.load(user.email)
    userInterests.value = interestsStore.items.map((item) => item.interest)
    badgesStore.loadBadges(user.email)
    badgesStore.checkBadges(selections.items || [], user.email)
    try {
      allFriends.value = await getFriends()
    } catch (e) {
      console.error('Error loading friends:', e)
    }
  }
}

loadUserData()

watch(
  () => auth.user?.email,
  (val) => {
    if (val) loadUserData()
  },
)
</script>

<style scoped>
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background-color: white;
}

/* Estilos da Barra de Progresso no Card */
.trips-counter-container {
  margin-bottom: 15px;
  width: 100%;
}

.counter-info {
  margin-bottom: 5px;
  text-align: right;
}

.counter-text {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.home-progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.home-progress-fill {
  height: 100%;
  background-color: #ffa27d;
  transition: width 0.5s ease-in-out;
}

.see-profile-btn {
  display: block;
  text-align: center;
}
</style>
