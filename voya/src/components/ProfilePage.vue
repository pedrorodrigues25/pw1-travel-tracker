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
  <div class="profile-layout-columns">
    <div class="profile-col-main">
      <div class="profile-header-row">
        <div class="profile-photo-circle">
          <label class="profile-photo-label" v-if="editMode">
            <input type="file" accept="image/*" @change="onPhotoChange" />
            <span class="profile-photo-upload-btn">Alterar foto</span>
          </label>
          <img
            v-if="user.value?.photoUrl && !previewPhoto"
            :src="user.value.photoUrl"
            class="profile-photo-lg"
            alt="Profile Photo"
          />
          <img
            v-else-if="previewPhoto"
            :src="previewPhoto"
            class="profile-photo-lg"
            alt="Preview"
          />
          <div v-else class="profile-avatar-lg">{{ userInitial }}</div>
        </div>
        <div class="profile-header-info">
          <div v-if="!editMode">
            <h2 class="profile-username-lg-horizontal">{{ user?.username || 'User' }}</h2>
            <p class="profile-email-lg-horizontal">{{ user?.email || '' }}</p>
          </div>
          <div v-else class="edit-fields-lg">
            <input v-model="editUsername" placeholder="Novo username" />
            <input v-model="editEmail" placeholder="Novo email" />
          </div>
        </div>
      </div>
      <div class="profile-progress-card">
        <div class="progress-header-lg">
          <span>Progresso</span>
          <span>{{ tripCount }}/{{ nextStep }} viagens</span>
        </div>
        <div class="progress-bar-container-lg">
          <div class="progress-bar-fill-lg" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
      <div class="profile-actions-lg">
        <button v-if="!editMode" class="action-btn edit-btn" @click="editMode = true">
          Editar Perfil
        </button>
        <button v-else class="action-btn save-btn" @click="saveProfile">Guardar</button>
        <button class="action-btn logout-btn" @click="handleLogout">Logout</button>
      </div>
    </div>
    <div class="profile-col-side">
      <div class="profile-about-card">
        <h3>About Me</h3>
        <div class="profile-interests-lg" v-if="userInterests.length > 0">
          <p><strong>My Interests</strong></p>
          <div class="interests-list-lg">
            <span
              v-for="interest in userInterests"
              :key="interest.id || interest"
              class="interest-chip-lg"
            >
              {{ typeof interest === 'object' ? interest.interest : interest }}
            </span>
          </div>
        </div>
        <textarea
          v-model="aboutMe"
          placeholder="Fala um pouco sobre ti..."
          rows="4"
          class="about-me-textarea"
        ></textarea>
      </div>
      <br />
      <button type="button" class="action-btn save-btn" @click="saveAboutMe">Save</button>

      
      <div class="profile-archived-card" v-if="archivedTrips.length">
        <h3>Viagens arquivadas</h3>
        <ul class="archived-list">
          <li
            v-for="trip in archivedTrips"
            :key="trip.id"
            class="archived-item"
            @click="goToJournal(trip.id)"
          >
            <span class="archived-title">
              <template v-if="trip.city">{{ trip.city }}, {{ trip.destination }}</template>
              <template v-else>{{ trip.destination }}</template>
            </span>
            <span class="archived-date">{{
              formatMonthYear(trip.startDate || trip.createdAt)
            }}</span>
          </li>
        </ul>
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
import { updateUser } from '../api/api'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const interestsStore = useInterestsStore()

const user = computed(() => auth.user)
const aboutMe = ref(user.value?.aboutMe || '')

onMounted(() => {
  if (auth.user?.email) {
    interestsStore.load(auth.user.email)
    selections.load(auth.user.email)
  }
})
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
  // Atualiza no backend
  if (user.value?.id) {
    const updated = await updateUser(user.value.id, updatedFields)
    if (updated) {
      user.value.username = updated.username
      user.value.email = updated.email
      if (updated.photoUrl) user.value.photoUrl = updated.photoUrl
    }
  } else {
    // fallback local
    user.value.username = editUsername.value
    user.value.email = editEmail.value
    if (previewPhoto.value) user.value.photoUrl = previewPhoto.value
  }
  editMode.value = false
}

async function saveAboutMe() {
  if (!user.value?.id) return
  const updated = await updateUser(user.value.id, { aboutMe: aboutMe.value })
  if (updated && typeof updated.aboutMe === 'string') {
    user.value.aboutMe = updated.aboutMe
    aboutMe.value = updated.aboutMe
  }
}

const userInitial = computed(() => {
  if (user.value?.username) {
    return user.value.username.charAt(0).toUpperCase()
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const tripCount = computed(() => selections.count || 0)
const interestsCount = computed(() => interestsStore.items.length)
const userInterests = computed(() => interestsStore.items)
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
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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
</script>

<style src="../css/ProfilePage.css"></style>
