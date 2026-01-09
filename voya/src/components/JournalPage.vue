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
          <!-- <div class="figma-journal-avatars">
            <img
              v-for="n in 5"
              :key="n"
              :src="`/src/img/avatar${n}.png`"
              class="figma-avatar"
              alt="avatar"
            />
          </div> -->
        </div>
        <div class="figma-journal-main">
          <div class="figma-journal-image-block">
            <img
              v-if="wikiInfo?.originalimage?.source"
              :src="wikiInfo.originalimage.source"
              :alt="wikiInfo.title"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px"
            />
          </div>
          <div class="figma-journal-day-block">
            <div class="figma-journal-day-title">About the destination</div>
            <div class="figma-journal-day-text">
              <template v-if="trip?.customText">{{ trip.customText }}</template>
              <template v-else-if="wikiInfo">{{ wikiInfo.extract }}</template>
              <template v-else>Information not available.</template>
            </div>
          </div>
        </div>
        
        <!-- Secção de amigos na viagem -->
        <div v-if="tripFriendsDetails.length > 0" class="figma-trip-friends">
          <h3>Friends on this trip</h3>
          <div class="friends-avatars">
            <div v-for="friend in tripFriendsDetails" :key="friend.id" class="friend-avatar-item">
              <div class="friend-avatar">
                <div v-if="!friend.photo" class="avatar-placeholder">
                  {{ friend.username.charAt(0).toUpperCase() }}
                </div>
                <img v-else :src="friend.photo" :alt="friend.username" />
              </div>
              <span class="friend-name">{{ friend.username }}</span>
            </div>
          </div>
        </div>
        
        <!-- Secção de fotos polaroid -->
        <div class="figma-journal-polaroids">
          <div 
            v-for="(photo, index) in photos" 
            :key="index" 
            class="figma-polaroid"
          >
            <img 
              v-if="photo" 
              :src="photo" 
              alt="Foto da viagem" 
              class="polaroid-photo"
            />
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
        
        <!-- Input escondido para upload de fotos -->
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileUpload" 
          accept="image/*" 
          multiple 
          style="display: none;"
        />

        <!-- Edit Panel -->
        <div v-if="editingPanel" class="edit-panel-overlay">
          <div class="edit-panel-modal">
            <h3>Edit Trip Information</h3>
            
            <div class="edit-section">
              <label>About the destination:</label>
              <textarea 
                v-model="editedText" 
                rows="6"
                class="edit-textarea"
                placeholder="Edit the destination description..."
              ></textarea>
            </div>

            <div class="edit-section">
              <label>Add Friends to this trip:</label>
              <div class="friends-list">
                <div 
                  v-for="friend in availableFriends" 
                  :key="friend.id"
                  class="friend-item"
                >
                  <input 
                    type="checkbox" 
                    :id="'friend-' + friend.id"
                    :checked="tripFriends.includes(friend.id)"
                    @change="toggleFriend(friend.id)"
                  />
                  <label :for="'friend-' + friend.id">{{ friend.username }}</label>
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
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSelectionsStore } from '../stores/selections'
import { fetchCountryWikipediaSummary, fetchWikipediaImages } from '../api/countries'
import { useAuthStore } from '../stores/auth'
import { getUserFriends, getFriends } from '../api/api'

const API_BASE = 'http://localhost:3001'

const props = defineProps({ tripId: [String, Number] })
const router = useRouter()
const selections = useSelectionsStore()
const auth = useAuthStore()
const trip = computed(() => selections.items.find((t) => t.id == props.tripId))

const tripFriendsDetails = computed(() => {
  if (!trip.value || !trip.value.friends || trip.value.friends.length === 0) return []
  return allFriendsData.value.filter(f => trip.value.friends.includes(f.id))
})

// Fotos da viagem
const photos = ref([])
const fileInput = ref(null)

// Edit panel state
const editingPanel = ref(false)
const editedText = ref('')
const availableFriends = ref([])
const tripFriends = ref([])
const allFriendsData = ref([])

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        photos: photos.value
      })
    })
    
    if (response.ok) {
      // Atualizar a store local
      const updatedTrip = await response.json()
      const index = selections.items.findIndex(t => t.id == props.tripId)
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
  editedText.value = trip.value?.customText || wikiInfo.value?.extract || ''
  tripFriends.value = trip.value?.friends || []
}

function cancelEdit() {
  editingPanel.value = false
  editedText.value = ''
  tripFriends.value = []
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
        customText: editedText.value,
        friends: tripFriends.value
      })
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex(t => t.id == props.tripId)
      if (index !== -1) selections.items[index] = updatedTrip
      editingPanel.value = false
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
      body: JSON.stringify({ archived: true })
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex(t => t.id == props.tripId)
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
      body: JSON.stringify({ archived: false })
    })
    if (response.ok) {
      const updatedTrip = await response.json()
      const index = selections.items.findIndex(t => t.id == props.tripId)
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

<style scoped>
.figma-journal-bg {
  min-height: 100vh;
  background: #e9e6e2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.figma-journal-container {
  background: #f7f4ef;
  border-radius: 28px;
  box-shadow: 0 4px 32px #0001;
  width: 900px;
  min-height: 700px;
  padding: 36px 48px 48px 48px;
  font-family: 'Quicksand', 'Inter', Arial, sans-serif;
  position: relative;
}
.figma-journal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
}
.figma-back-btn {
  position: absolute;
  left: 32px;
  top: 32px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
}
.figma-journal-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
}
.figma-journal-title {
  font-size: 3rem;
  font-family: 'Amatic SC', cursive, sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: #222;
}
.figma-edit-btn {
  position: absolute;
  right: 32px;
  top: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0eeea;
  border: 1px solid #ddd;
  border-radius: 24px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.figma-edit-btn:hover {
  background: #e8e6e2;
  box-shadow: 0 2px 8px #0001;
}
.figma-edit-btn .edit-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.figma-delete-btn .delete-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}
.figma-archive-btn .archive-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}
.figma-delete-btn {
  position: absolute;
  right: 32px;
  top: 96px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fdecea;
  border: 1px solid #f5c2c7;
  border-radius: 24px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #c0392b;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.figma-delete-btn:hover {
  background: #fbd5d7;
  box-shadow: 0 2px 8px #0001;
}
.figma-archive-btn {
  position: absolute;
  right: 32px;
  top: 144px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eef6ff;
  border: 1px solid #bcd0ff;
  border-radius: 24px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #1f4bd8;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.figma-archive-btn:hover {
  background: #e2efff;
  box-shadow: 0 2px 8px #0001;
}
.figma-unarchive-btn {
  position: absolute;
  right: 32px;
  top: 144px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eef9f3;
  border: 1px solid #b8e6c9;
  border-radius: 24px;
  padding: 10px 18px;
  font-size: 1rem;
  color: #1d8f4a;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.figma-unarchive-btn:hover {
  background: #dff4e8;
  box-shadow: 0 2px 8px #0001;
}
.figma-journal-dates {
  font-size: 1.1rem;
  color: #888;
  margin-bottom: 10px;
}
.figma-journal-avatars {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.figma-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  background: #ddd;
}
.figma-journal-main {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}
.figma-journal-image-block {
  width: 160px;
  height: 140px;
  background: #d6d3ce;
  border-radius: 16px;
  margin-top: 8px;
}
.figma-journal-day-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.figma-journal-day-title {
  font-size: 2.1rem;
  font-family: 'Amatic SC', cursive, sans-serif;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}
.figma-journal-day-text {
  font-size: 1.08rem;
  color: #444;
  line-height: 1.5;
  font-family: 'Quicksand', 'Inter', Arial, sans-serif;
}
.figma-journal-polaroids {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  justify-content: flex-start;
}
.figma-polaroid {
  width: 140px;
  height: 160px;
  background-image: url('../img/modelofoto.png');
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px 10px 30px 10px;
  box-sizing: border-box;
}
.figma-polaroid.empty {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.figma-polaroid.empty:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
.polaroid-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
.add-photo-icon {
  font-size: 2.5rem;
  color: #aaa;
  font-weight: 300;
}
.journal-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: 1.5rem;
  font-family: 'Quicksand', 'Inter', Arial, sans-serif;
}
.edit-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.edit-panel-modal {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.edit-panel-modal h3 {
  margin: 0 0 24px 0;
  color: #222;
  font-size: 1.3rem;
}
.edit-section {
  margin-bottom: 24px;
}
.edit-section label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}
.edit-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Quicksand', Arial, sans-serif;
  font-size: 0.95rem;
  resize: vertical;
}
.edit-textarea:focus {
  outline: none;
  border-color: #0d5678;
  box-shadow: 0 0 0 2px rgba(13, 86, 120, 0.1);
}
.friends-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.friend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.friend-item input[type="checkbox"] {
  cursor: pointer;
}
.friend-item label {
  margin: 0;
  cursor: pointer;
  font-weight: 400;
}
.no-friends {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}
.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.btn-save, .btn-cancel {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save {
  background: #0d5678;
  color: #fff;
}
.btn-save:hover {
  background: #0a3f53;
}
.btn-cancel {
  background: #e8e8e8;
  color: #333;
}
.btn-cancel:hover {
  background: #d8d8d8;
}
.figma-trip-friends {
  margin-bottom: 24px;
}
.figma-trip-friends h3 {
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  font-family: 'Amatic SC', cursive, sans-serif;
  font-weight: 700;
  color: #222;
}
.friends-avatars {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.friend-avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #d6d3ce;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #0d5678;
}
.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5b8ba8, #7ba4c2);
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
}
.friend-name {
  font-size: 0.85rem;
  color: #555;
  text-align: center;
  max-width: 70px;
  word-break: break-word;
}
</style>
