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

  <div class="home-container">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <h1>Welcome back, <span class="username">{{ user?.username || 'User' }}</span></h1>
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
          <span v-for="(interest, idx) in userInterests.slice(0, 5)" :key="idx" class="interest-badge">
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

    <!-- See Your Trips Section -->
    <div class="see-your-trips">
      <h2>SEE YOUR TRIPS</h2>
      <div class="trips-grid">
        <!-- Your Last Trip -->
        <div class="trip-card last-trip">
          <div class="trip-label">YOUR LAST TRIP</div>
          <div v-if="lastTrip" class="trip-card-wrapper">
            <div class="trip-image-container">
              <img v-if="lastTrip.imageUrl" :src="lastTrip.imageUrl" :alt="lastTrip.destination" class="trip-image" />
              <div v-else class="image-placeholder"></div>
            </div>
            <div class="trip-content">
              <p class="trip-title">{{ lastTrip.city }}, {{ lastTrip.destination }}</p>
              <p class="trip-date" v-if="lastTrip.startDate">{{ lastTrip.startDate }}</p>
              <div class="trip-friends-list" v-if="lastTripFriendsDetails && lastTripFriendsDetails.length > 0">
                <p class="friends-label">Friends:</p>
                <div class="friends-names">
                  <span v-for="friend in lastTripFriendsDetails" :key="friend.id" class="friend-name-tag">
                    {{ friend.username }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="trip-empty">
            <p>No trips yet</p>
          </div>
        </div>

        <!-- Total Trips -->
        <div class="trip-card total-trips">
          <div class="trip-label">TOTAL TRIPS</div>
          <div class="trip-chart">
            <div class="chart-container">
              <div class="chart-bars">
                <div class="bar-group">
                  <div class="bar-wrapper">
                    <div class="bar completed" :style="{ height: completedPercentage + '%' }"></div>
                    <span class="bar-label">Completed</span>
                  </div>
                  <div class="bar-count">{{ completedTrips }}</div>
                </div>
                <div class="bar-group">
                  <div class="bar-wrapper">
                    <div class="bar upcoming" :style="{ height: upcomingPercentage + '%' }"></div>
                    <span class="bar-label">Upcoming</span>
                  </div>
                  <div class="bar-count">{{ upcomingTrips }}</div>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color completed"></span>
                  <span>Completed</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color upcoming"></span>
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Badges Section -->
    <div class="badges-section">
      <h2>BADGES</h2>
      <div class="badges-grid">
        <div class="badges-card your-badges">
          <div class="badge-label">YOUR BADGES</div>
          <div class="badge-list">
            <p class="empty-message">Badges will appear here</p>
          </div>
        </div>
        <div class="badges-card badges-to-unlock">
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
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'
import { getFriends } from '../api/api'
import '../css/DestinationsList.css'


const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()

const user = auth.user
const userInterests = ref([])
const allFriends = ref([])

const lastTrip = computed(() => {
  if (selections.items.length === 0) return null
  return selections.items[selections.items.length - 1]
})

const lastTripFriendsDetails = computed(() => {
  if (!lastTrip.value || !lastTrip.value.friends || lastTrip.value.friends.length === 0) return []
  return allFriends.value.filter(f => lastTrip.value.friends.includes(f.id))
})

const completedTrips = computed(() => {
  return selections.items.filter(trip => trip.status === 'completed').length
})

const upcomingTrips = computed(() => {
  return selections.items.filter(trip => trip.status === 'upcoming').length
})

const totalTripsCount = computed(() => completedTrips.value + upcomingTrips.value)

const completedPercentage = computed(() => {
  if (totalTripsCount.value === 0) return 0
  return (completedTrips.value / totalTripsCount.value) * 100
})

const upcomingPercentage = computed(() => {
  if (totalTripsCount.value === 0) return 0
  return (upcomingTrips.value / totalTripsCount.value) * 100
})

async function loadUserData() {
  if (user && user.email) {
    await selections.load(user.email)
    await interestsStore.load(user.email)
    userInterests.value = interestsStore.items.map(item => item.interest)
    
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
<style src="../css/DestinationsList.css"></style>
