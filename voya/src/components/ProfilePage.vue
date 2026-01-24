<template>
  <div class="profile-page">
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

    <div class="profile-content">
      <div class="profile-left-column">
        <div class="profile-card">
          <div class="profile-cover"></div>
          <div class="profile-avatar-section">
            <div class="profile-avatar-wrapper">
              <img :src="avatarQuery" :alt="user?.username" class="profile-avatar-img" />
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

            <div class="profile-progress">
              <div class="progress-header">
                <span>Trip Progress</span>
                <span>{{ tripCount }}/{{ nextStep }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>

            <div class="profile-actions-row">
              <button v-if="!editMode" class="btn-edit" @click="editMode = true">
                Edit Profile
              </button>
              <button v-else class="btn-save" @click="saveProfile">Save</button>
              <button class="btn-logout" @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>

        <div class="about-card">
          <h3>About Me</h3>
          <textarea
            v-model="aboutMe"
            placeholder="Tell us about yourself..."
            rows="3"
            class="about-textarea"
            maxlength="200"
            style="resize: none"
          ></textarea>
          <span class="char-counter">{{ aboutMe.length }}/200</span>
          <button class="btn-save-about" @click="saveAboutMe">Save</button>

          <div class="interests-section">
            <div class="interests-header">
              <h4>My Interests</h4>
              <button class="btn-edit-interests" @click="openInterestsModal">Edit</button>
            </div>
            <div v-if="userInterests.length > 0" class="interests-grid">
              <span
                v-for="interest in userInterests"
                :key="interest.id || interest"
                class="interest-tag"
              >
                {{ typeof interest === 'object' ? interest.interest : interest }}
              </span>
            </div>
            <div v-else class="empty-interests">
              <p>No interests yet. Add some!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-right-column">
        <div class="friends-card">
          <div class="card-header">
            <h3>Friends</h3>
            <router-link to="/friends" class="see-all-link">See all →</router-link>
          </div>
          <div v-if="friends.length > 0" class="friends-grid">
            <div v-for="friend in friends.slice(0, 6)" :key="friend.id" class="friend-mini-card">
              <div class="friend-avatar">
                <img
                  :src="`https://api.dicebear.com/9.x/identicon/png?seed=${friend.username}&scale=70`"
                  :alt="friend.username"
                />
              </div>
              <span class="friend-name">{{ friend.username }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No friends yet</p>
            <router-link to="/friends" class="add-friends-link">Find friends</router-link>
          </div>
        </div>

        <div class="badges-card badges-only-icons">
          <div class="badges-title-row"><h3>Badges Earned</h3></div>
          <div v-if="unlockedBadges.length > 0" class="badges-grid badges-icons-grid">
            <img
              v-for="badge in unlockedBadges"
              :key="badge.id"
              :src="badge.imageUrl"
              :alt="badge.name"
              class="badge-img-only"
            />
          </div>
          <div v-else class="empty-state"></div>
        </div>

        <div class="archived-card">
          <div class="card-header">
            <h3>Archived Trips</h3>
            <span class="archived-count">{{ archivedTrips.length }} trips</span>
          </div>
          <div v-if="archivedTrips.length > 0" class="archived-list">
            <div
              v-for="trip in archivedTrips"
              :key="trip.id"
              class="archived-item"
              @click="goToJournal(trip.id)"
            >
              <div class="archived-info">
                <span class="archived-destination">
                  <template v-if="trip.city">{{ trip.city }}, {{ trip.destination }}</template>
                  <template v-else>{{ trip.destination }}</template>
                </span>
                <span class="archived-date">{{
                  formatMonthYear(trip.startDate || trip.createdAt)
                }}</span>
              </div>
              <span class="archived-arrow">→</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No archived trips</p>
            <span class="empty-hint">Archive completed trips to save memories</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interests Edit Modal -->
    <div v-if="showInterestsModal" class="modal-overlay" @click.self="closeInterestsModal">
      <div class="modal-content interests-modal">
        <div class="modal-header">
          <h3>Edit Interests</h3>
          <button class="modal-close" @click="closeInterestsModal">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-hint">Select your interests</p>
          <div class="interests-tags-modal">
            <button
              v-for="interest in availableInterests"
              :key="interest"
              :class="['interest-tag-modal', { selected: selectedInterests.includes(interest) }]"
              @click="toggleInterest(interest)"
            >
              {{ interest }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeInterestsModal">Cancel</button>
          <button class="btn-save-interests" @click="saveInterests">Save Interests</button>
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
import { updateUser, getUserFriends, getAvailableInterests } from '../api/api'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()
const badgesStore = useBadgesStore()

const user = computed(() => auth.user)
const aboutMe = ref(user.value?.aboutMe || '')
const friends = ref([])

// Interests modal state
const showInterestsModal = ref(false)
const availableInterests = ref([])
const selectedInterests = ref([])

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
    friends.value = await getUserFriends(auth.user.email)
  } catch (e) {
    console.error('Error loading friends:', e)
  }
}

const editMode = ref(false)
const editUsername = ref(user.value?.username || '')
const editEmail = ref(user.value?.email || '')
const previewPhoto = ref('')

// Lógica de Avatar dinâmica baseada no username
const avatarQuery = computed(() => {
  const seed = user.value?.username || 'voya-user'
  return `https://api.dicebear.com/9.x/identicon/png?seed=${seed}&scale=70&backgroundColor=#ffffff`
})

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
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

function goToJournal(tripId) {
  router.push({ name: 'Journal', params: { tripId } })
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

// Interests modal functions
async function openInterestsModal() {
  // Load available interests
  const interests = await getAvailableInterests()
  availableInterests.value = interests.map((i) => i.name) || []

  // Set currently selected interests
  selectedInterests.value = userInterests.value.map((i) => (typeof i === 'object' ? i.interest : i))

  showInterestsModal.value = true
}

function closeInterestsModal() {
  showInterestsModal.value = false
}

function toggleInterest(interest) {
  const index = selectedInterests.value.indexOf(interest)
  if (index === -1) {
    selectedInterests.value.push(interest)
  } else {
    selectedInterests.value.splice(index, 1)
  }
}

async function saveInterests() {
  if (!auth.user?.email) return
  await interestsStore.setInterests(selectedInterests.value, auth.user.email)
  await interestsStore.load(auth.user.email)
  closeInterestsModal()
}
</script>

<style scoped>
/* Estilos específicos para o Avatar */
.profile-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background-color: white;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>

<style src="../css/ProfilePage.css"></style>
