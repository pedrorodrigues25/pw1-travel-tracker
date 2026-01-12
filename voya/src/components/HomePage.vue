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
      <h1 class="voya-section-title">
        Welcome back, <span class="username voya-no-transform">{{ user?.username || 'User' }}</span>
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
        <div class="badges-card your-badges">
          <div class="badge-label">YOUR LAST TRIP</div>
          <div class="badge-list">
            <p class="trip-title">Badges will appear here</p>
          </div>
        </div>
        <div class="badges-card badges-to-unlock">
          <div class="badge-label">NEXT TRIPS</div>
          <div class="badge-list">
            <p class="empty-message">Locked badges will appear here</p>
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
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'
import { getFriends } from '../api/api'
import '../css/HomePage.css'

const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()

const user = auth.user
const userInterests = ref([])
const allFriends = ref([])

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
