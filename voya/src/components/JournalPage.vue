<template>
  <div class="figma-journal-bg">
    <div class="figma-journal-container">
      <div v-if="trip && trip.destination">
        <div class="figma-journal-header">
          <button class="figma-back-btn" @click="$router.back()">←</button>
          <div class="figma-journal-title-row">
            <div class="figma-journal-title">
              <template v-if="trip.city">{{ trip.city }}, {{ trip.destination }}</template>
              <template v-else>{{ trip.destination || 'Destino' }}</template>
            </div>
            <button class="figma-edit-btn" @click="editTrip">
              <img src="../img/editar.png" alt="Edit" class="edit-icon" />
              <span>Edit</span>
            </button>
            <button class="figma-delete-btn" @click="deleteTrip">
              <img src="../img/delete.png" alt="Delete" class="delete-icon" />
              <span>Delete</span>
            </button>
            <button v-if="!trip.archived" class="figma-archive-btn" @click="archiveTrip">
              <img src="../img/archive.png" alt="Archive" class="archive-icon" />
              <span>Archive</span>
            </button>
            <button v-if="trip.archived" class="figma-unarchive-btn" @click="unarchiveTrip">
              <span>Unarchive</span>
            </button>
          </div>
          <div class="figma-journal-dates">
            <template v-if="trip.startDate || trip.endDate">
              <span v-if="trip.startDate">{{ trip.startDate }}</span>
              <span v-if="trip.startDate && trip.endDate"> - </span>
              <span v-if="trip.endDate">{{ trip.endDate }}</span>
            </template>
          </div>
        </div>
        <div class="figma-journal-main">
          <div class="figma-journal-image-block">
            <div class="journal-hero">
              <div v-if="showHeroLoading" class="journal-hero-loading" aria-live="polite">
                <div class="loading-spinner" aria-hidden="true"></div>
              </div>
              <img
                v-if="wikiInfo?.originalimage?.source"
                class="journal-hero-main"
                :class="{ loaded: heroImageLoaded }"
                :src="wikiInfo.originalimage.source"
                :alt="wikiInfo.title || 'Destination image'"
                @load="onHeroLoad"
                @error="onHeroError"
              />
            </div>
          </div>
          <div class="figma-journal-day-block">
            <div class="figma-journal-day-title">About the destination</div>
            <div class="figma-journal-day-text">
              <template v-if="wikiInfo">{{ wikiInfo.extract }}</template>
              <template v-else>Information not available.</template>
            </div>
          </div>
        </div>

        <!-- User Notes Section -->
        <div v-if="trip?.notes" class="notes-section">
          <div class="notes-header">
            <span class="notes-icon">📝</span>
            <span class="notes-title">My Notes</span>
          </div>
          <div class="notes-content">{{ trip.notes }}</div>
        </div>

        <!-- Secção de amigos e fotos lado a lado -->
        <div class="figma-friends-photos-row">
          <!-- Secção de amigos na viagem -->
          <div v-if="tripFriendsDetails.length > 0" class="figma-trip-friends">
            <h3>Friends on this trip</h3>
            <div class="friends-avatars">
              <div
                v-for="friend in tripFriendsDetails"
                :key="friend.id"
                class="friend-avatar-item clickable"
                @click="openPersonProfile(friend)"
              >
                <div class="friend-avatar">
                  <div v-if="!friend.photo" class="avatar-placeholder">
                    {{ friend.username.charAt(0).toUpperCase() }}
                  </div>
                  <img v-else :src="friend.photo" :alt="friend.username" />
                </div>
              </div>
            </div>
          </div>

          <!-- Secção de fotos polaroid -->
          <div class="figma-journal-polaroids">
            <div v-for="(photo, index) in photos" :key="index" class="figma-polaroid">
              <img v-if="photo" :src="photo" alt="Foto da viagem" class="polaroid-photo" />
            </div>
            <!-- Slots vazios para completar 4 -->
            <div
              v-for="n in Math.max(0, 4 - photos.length)"
              :key="'empty-' + n"
              class="figma-polaroid empty"
              @click="triggerFileInput"
            >
              <span class="add-photo-icon">+</span>
            </div>
          </div>
        </div>

        <!-- Input escondido para upload de fotos -->
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept="image/*"
          multiple
          style="display: none"
        />

        <!-- Edit Panel -->
        <div v-if="editingPanel" class="edit-panel-overlay">
          <div class="edit-panel-modal">
            <h3>Edit Trip Information</h3>

            <div class="edit-section">
              <label>My Notes:</label>
              <textarea
                v-model="editedNotes"
                rows="6"
                class="edit-textarea"
                placeholder="Add your personal notes about this trip..."
              ></textarea>
            </div>

            <div class="edit-section">
              <label>Add Friends to this trip:</label>
              <div class="friends-list">
                <div v-for="friend in availableFriends" :key="friend.id" class="friend-item">
                  <input
                    type="checkbox"
                    :id="'friend-' + friend.id"
                    :checked="tripFriends.includes(friend.id)"
                    @change="toggleFriend(friend.id)"
                  />
                </div>
              </div>
              <p v-if="availableFriends.length === 0" class="no-friends">No friends available.</p>
            </div>

            <div class="edit-actions">
              <button class="btn-save" @click="saveEdits">Save</button>
              <button class="btn-cancel" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="journal-not-found">
        <p>Viagem não encontrada.</p>
      </div>

      <!-- Profile Modal -->
      <div
        v-if="showProfileModal && selectedPerson"
        class="profile-modal-overlay"
        @click.self="closeProfileModal"
      >
        <div class="profile-modal">
          <button class="modal-close" @click="closeProfileModal">×</button>
          <div class="profile-modal-header">
            <div class="person-avatar modal-avatar">
              <img
                v-if="selectedPerson.photo"
                :src="selectedPerson.photo"
                :alt="selectedPerson.username"
              />
              <div v-else class="avatar-placeholder">
                {{ selectedPerson.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="profile-meta">
              <h3>{{ selectedPerson.username }}</h3>
              <p class="profile-email" v-if="selectedPerson.email">{{ selectedPerson.email }}</p>
            </div>
          </div>
          <p class="profile-about" v-if="selectedPerson.aboutMe">{{ selectedPerson.aboutMe }}</p>
          <div
            v-if="selectedPerson.interests && selectedPerson.interests.length"
            class="profile-interests"
          >
            <span v-for="interest in selectedPerson.interests" :key="interest" class="chip">{{
              interest
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Badge Notification -->
  <BadgeNotification
    :show="badgesStore.showNotification"
    :badge="badgesStore.newBadge"
    @close="badgesStore.closeNotification()"
  />
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectionsStore } from '../stores/selections'
import { useBadgesStore } from '../stores/badges'
import { fetchCountryWikipediaSummary, fetchWikipediaImages } from '../api/countries'
import { useAuthStore } from '../stores/auth'
import { getUserFriends, getFriends } from '../api/api'
import BadgeNotification from './BadgeNotification.vue'
import '../css/Journal.css'
import '../css/FriendsPage.css'

const API_BASE = 'http://localhost:3001'

const props = defineProps({ tripId: [String, Number] })
const router = useRouter()
const selections = useSelectionsStore()
const badgesStore = useBadgesStore()
const auth = useAuthStore()
const trip = computed(() => selections.items.find((t) => t.id == props.tripId))

const tripFriendsDetails = computed(() => {
  if (!trip.value || !trip.value.friends || trip.value.friends.length === 0) return []
  return allFriendsData.value.filter((f) => trip.value.friends.includes(f.id))
})

// Fotos da viagem
const photos = ref([])
const fileInput = ref(null)

// Edit panel state
const editingPanel = ref(false)
const editedNotes = ref('')
const availableFriends = ref([])
const tripFriends = ref([])
const allFriendsData = ref([])

// Profile modal state
const showProfileModal = ref(false)
const selectedPerson = ref(null)

// Carregar fotos da viagem do servidor
async function loadPhotos() {
  if (trip.value?.photos) {
    photos.value = [...trip.value.photos]
  }
}

// Guardar fotos no servidor
async function savePhotos() {
  if (!trip.value) return

  try {
    const response = await fetch(`${API_BASE}/selections/${props.tripId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photos: photos.value,
      }),
    })

    if (response.ok) {
      // Atualizar a store local
      const updatedTrip = await response.json()
      const index = selections.items.findIndex((t) => t.id == props.tripId)
      if (index !== -1) {
        selections.items[index] = updatedTrip
      }
    }
  } catch (error) {
    console.error('Erro ao guardar fotos:', error)
  }
}

function editTrip() {
  if (auth.isGuest) {
    alert('Please log in to edit trips.')
    return
  }
  editingPanel.value = true
  editedNotes.value = trip.value?.notes || ''
  tripFriends.value = trip.value?.friends || []
}

function cancelEdit() {
  editingPanel.value = false
  editedNotes.value = ''
  tripFriends.value = []
}

function openPersonProfile(person) {
  selectedPerson.value = person
  showProfileModal.value = true
}

function closeProfileModal() {
  showProfileModal.value = false
  selectedPerson.value = null
}

function toggleFriend(friendId) {
  const idx = tripFriends.value.indexOf(friendId)
  if (idx === -1) {
    tripFriends.value.push(friendId)
  } else {
    tripFriends.value.splice(idx, 1)
  }
}

async function saveEdits() {
  if (!trip.value) return
  try {
    const response = await fetch(`${API_BASE}/selections/${props.tripId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: editedNotes.value,
        friends: tripFriends.value,
      }),
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex((t) => t.id == props.tripId)
      if (index !== -1) selections.items[index] = updatedTrip
      editingPanel.value = false

      // Check for new badges after adding friends to a trip
      if (auth.user?.email) {
        badgesStore.checkBadges(selections.items, auth.user.email)
      }
    } else {
      alert('Could not save changes.')
    }
  } catch (e) {
    console.error('Erro ao guardar edições:', e)
    alert('Could not save changes.')
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const files = event.target.files
  if (files) {
    for (const file of files) {
      if (photos.value.length < 4) {
        const reader = new FileReader()
        reader.onload = (e) => {
          photos.value.push(e.target.result)
          // Guardar automaticamente após adicionar foto
          savePhotos()
        }
        reader.readAsDataURL(file)
      }
    }
  }
  // Limpar input para permitir selecionar o mesmo ficheiro novamente
  event.target.value = ''
}

async function deleteTrip() {
  if (!trip.value) return
  if (auth.isGuest) {
    alert('Please log in to delete trips.')
    return
  }
  if (!confirm('Delete this trip and its journal?')) return
  const deleted = await selections.remove(props.tripId)
  if (!deleted) {
    alert('Could not delete this trip. Please try again.')
    return
  }
  router.push('/trips')
}

async function archiveTrip() {
  if (!trip.value) return
  if (auth.isGuest) {
    alert('Please log in to archive trips.')
    return
  }
  try {
    const response = await fetch(`${API_BASE}/selections/${props.tripId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: true }),
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex((t) => t.id == props.tripId)
      if (index !== -1) selections.items[index] = updatedTrip
    } else {
      alert('Could not archive this trip. Please try again.')
    }
  } catch (e) {
    console.error('Erro ao arquivar viagem:', e)
    alert('Could not archive this trip. Please try again.')
  }
}

async function unarchiveTrip() {
  if (!trip.value) return
  if (auth.isGuest) {
    alert('Please log in to unarchive trips.')
    return
  }
  try {
    const response = await fetch(`${API_BASE}/selections/${props.tripId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: false }),
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex((t) => t.id == props.tripId)
      if (index !== -1) selections.items[index] = updatedTrip
    } else {
      alert('Could not unarchive this trip. Please try again.')
    }
  } catch (e) {
    console.error('Erro ao desarquivar viagem:', e)
    alert('Could not unarchive this trip. Please try again.')
  }
}

const wikiInfo = ref(null)
const wikiLoading = ref(false)
const wikiError = ref(null)
const wikiImages = ref([])

const heroImageLoaded = ref(false)
const heroImageError = ref(false)

const showHeroLoading = computed(() => {
  if (wikiLoading.value) return true
  if (!wikiInfo.value?.originalimage?.source) return false
  return !heroImageLoaded.value && !heroImageError.value
})

function onHeroLoad() {
  heroImageError.value = false
  heroImageLoaded.value = true
}

function onHeroError() {
  heroImageLoaded.value = false
  heroImageError.value = true
}

watch(
  () => wikiInfo.value?.originalimage?.source,
  () => {
    heroImageLoaded.value = false
    heroImageError.value = false
  },
)

onMounted(async () => {
  // Carregar fotos guardadas
  loadPhotos()

  // Carregar dados de todos os amigos para resolução de avatares
  try {
    const allFriends = await getFriends()
    allFriendsData.value = allFriends
  } catch (e) {
    console.error('Erro ao carregar dados de amigos:', e)
  }

  // Carregar amigos do utilizador (apenas os amigos adicionados)
  const userEmail = auth.user?.email
  if (userEmail) {
    try {
      const userFriends = await getUserFriends(userEmail)
      availableFriends.value = userFriends
    } catch (e) {
      console.error('Erro ao carregar amigos:', e)
    }
  }

  let query = trip.value?.city || trip.value?.destination
  if (query) {
    wikiLoading.value = true
    wikiError.value = null
    wikiInfo.value = null
    heroImageLoaded.value = false
    heroImageError.value = false
    const result = await fetchCountryWikipediaSummary(query)
    if (result.error) {
      wikiError.value = result.error
    } else {
      wikiInfo.value = result
      // Buscar imagens extras
      wikiImages.value = await fetchWikipediaImages(query)
    }
    wikiLoading.value = false
  }
})
</script>
