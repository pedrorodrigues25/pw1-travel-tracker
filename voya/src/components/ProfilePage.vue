<template>
  <div class="profile-page">
    <!-- Navbar -->
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

    <!-- Main Content -->
    <div class="profile-content">
      <!-- Left Column - Profile Info -->
      <div class="profile-left-column">
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-cover"></div>
          <div class="profile-avatar-section">
            <div class="profile-avatar-wrapper">
              <label class="profile-photo-label" v-if="editMode">
                <input type="file" accept="image/*" @change="onPhotoChange" />
                <span class="photo-edit-overlay">📷</span>
              </label>
              <img
                v-if="user?.photoUrl && !previewPhoto"
                :src="user.photoUrl"
                class="profile-avatar-img"
                alt="Profile Photo"
              />
              <img
                v-else-if="previewPhoto"
                :src="previewPhoto"
                class="profile-avatar-img"
                alt="Preview"
              />
              <div v-else class="profile-avatar-placeholder">{{ userInitial }}</div>
            </div>
          </div>

          <div class="profile-info-section">
            <div v-if="!editMode">
              <h1 class="profile-name">{{ user?.username || 'User' }}</h1>
              <p class="profile-email-text">{{ user?.email || '' }}</p>
            </div>
            <div v-else class="edit-fields">
              <input v-model="editUsername" placeholder="Username" class="edit-input" />
              <input v-model="editEmail" placeholder="Email" class="edit-input" />
            </div>

            <!-- Stats -->
            <div class="profile-stats-row">
              <div class="stat-box">
                <span class="stat-number">{{ tripCount }}</span>
                <span class="stat-label">Trips</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">{{ friendsCount }}</span>
                <span class="stat-label">Friends</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">{{ unlockedBadges.length }}</span>
                <span class="stat-label">Badges</span>
              </div>
            </div>

            <!-- Progress -->
            <div class="profile-progress">
              <div class="progress-header">
                <span>Trip Progress</span>
                <span>{{ tripCount }}/{{ nextStep }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="profile-actions-row">
              <button v-if="!editMode" class="btn-edit" @click="editMode = true">
                ✏️ Edit Profile
              </button>
              <button v-else class="btn-save" @click="saveProfile">💾 Save</button>
              <button class="btn-logout" @click="handleLogout">🚪 Logout</button>
            </div>
          </div>
        </div>

        <!-- About Me Card -->
        <div class="about-card">
          <h3>📝 About Me</h3>
          <textarea
            v-model="aboutMe"
            placeholder="Tell us about yourself..."
            rows="3"
            class="about-textarea"
          ></textarea>
          <button class="btn-save-about" @click="saveAboutMe">Save</button>

          <!-- Interests -->
          <div v-if="userInterests.length > 0" class="interests-section">
            <h4>🎯 My Interests</h4>
            <div class="interests-grid">
              <span
                v-for="interest in userInterests"
                :key="interest.id || interest"
                class="interest-tag"
              >
                {{ typeof interest === 'object' ? interest.interest : interest }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Friends, Badges, Archived -->
      <div class="profile-right-column">
        <!-- Friends Card -->
        <div class="friends-card">
          <div class="card-header">
            <h3>👥 Friends</h3>
            <router-link to="/friends" class="see-all-link">See all →</router-link>
          </div>
          <div v-if="friends.length > 0" class="friends-grid">
            <div v-for="friend in friends.slice(0, 6)" :key="friend.id" class="friend-mini-card">
              <div class="friend-avatar">
                <img v-if="friend.photo" :src="friend.photo" :alt="friend.username" />
                <span v-else class="avatar-letter">{{ friend.username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="friend-name">{{ friend.username }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon">😔</span>
            <p>No friends yet</p>
            <router-link to="/friends" class="add-friends-link">Find friends</router-link>
          </div>
        </div>

        <!-- Badges Card -->
        <div class="badges-card badges-only-icons">
          <div class="badges-title-row"><h3>🏆 Badges Earned</h3></div>
          <div v-if="unlockedBadges.length > 0" class="badges-grid badges-icons-grid">
            <img v-for="badge in unlockedBadges" :key="badge.id" :src="badge.imageUrl" :alt="badge.name" class="badge-img-only" />
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon">🎖️</span>
          </div>
        </div>

        <!-- Archived Trips Card -->
        <div class="archived-card">
          <div class="card-header">
            <h3>📦 Archived Trips</h3>
            <span class="archived-count">{{ archivedTrips.length }} trips</span>
          </div>
          <div v-if="archivedTrips.length > 0" class="archived-list">
            <div
              v-for="trip in archivedTrips"
              :key="trip.id"
              class="archived-item"
              @click="goToJournal(trip.id)"
            >
              <div class="archived-icon">🗺️</div>
              <div class="archived-info">
                <span class="archived-destination">
                  <template v-if="trip.city">{{ trip.city }}, {{ trip.destination }}</template>
                  <template v-else>{{ trip.destination }}</template>
                </span>
                <span class="archived-date">{{ formatMonthYear(trip.startDate || trip.createdAt) }}</span>
              </div>
              <span class="archived-arrow">→</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <span class="empty-icon">📁</span>
            <p>No archived trips</p>
            <span class="empty-hint">Archive completed trips to save memories</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useInterestsStore } from '../stores/interests'
import { useBadgesStore } from '../stores/badges'
import { updateUser, getUserFriends, getFriends } from '../api/api'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()
const badgesStore = useBadgesStore()

const user = computed(() => auth.user)
const aboutMe = ref(user.value?.aboutMe || '')
const friends = ref([])

onMounted(async () => {
  if (auth.user?.email) {
    interestsStore.load(auth.user.email)
    await selections.load(auth.user.email)
    badgesStore.loadBadges(auth.user.email)
    badgesStore.checkBadges(selections.items, auth.user.email)
    await loadFriends()
  }
})

async function loadFriends() {
  if (!auth.user?.email) return
  try {
    const userFriendIds = await getUserFriends(auth.user.email)
    const allFriends = await getFriends()
    friends.value = allFriends.filter((f) => userFriendIds.includes(f.id))
  } catch (e) {
    console.error('Error loading friends:', e)
  }
}

const editMode = ref(false)
const editUsername = ref(user.value?.username || '')
const editEmail = ref(user.value?.email || '')
const previewPhoto = ref('')

function onPhotoChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewPhoto.value = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function saveProfile() {
  const updatedFields = {
    username: editUsername.value,
    email: editEmail.value,
  }
  if (previewPhoto.value) updatedFields.photoUrl = previewPhoto.value
  if (user.value?.id) {
    const updated = await updateUser(user.value.id, updatedFields)
    if (updated) {
      auth.user.username = updated.username
      auth.user.email = updated.email
      if (updated.photoUrl) auth.user.photoUrl = updated.photoUrl
    }
  }
  editMode.value = false
}

async function saveAboutMe() {
  if (!user.value?.id) return
  const updated = await updateUser(user.value.id, { aboutMe: aboutMe.value })
  if (updated && typeof updated.aboutMe === 'string') {
    auth.user.aboutMe = updated.aboutMe
    aboutMe.value = updated.aboutMe
  }
}

const userInitial = computed(() => {
  if (user.value?.username) return user.value.username.charAt(0).toUpperCase()
  if (user.value?.email) return user.value.email.charAt(0).toUpperCase()
  return 'U'
})

const tripCount = computed(() => selections.count || 0)
const friendsCount = computed(() => friends.value.length)
const userInterests = computed(() => interestsStore.items)
const unlockedBadges = computed(() => badgesStore.unlockedBadges)

const nextStep = computed(() => {
  const c = tripCount.value || 0
  return c === 0 ? 10 : Math.ceil(c / 10) * 10
})

const progressPercentage = computed(() => {
  const c = tripCount.value || 0
  const step = nextStep.value
  return Math.min(100, Math.round((c / step) * 100))
})

const archivedTrips = computed(() => selections.items.filter((t) => t.archived))

function formatMonthYear(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

function goToJournal(tripId) {
  router.push({ name: 'Journal', params: { tripId } })
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style src="../css/ProfilePage.css"></style>
