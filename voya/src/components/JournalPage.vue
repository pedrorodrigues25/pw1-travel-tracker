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
              <span>Delete</span>
            </button>
            <button v-if="!trip.archived" class="figma-archive-btn" @click="archiveTrip">
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
              <template v-if="wikiInfo">{{ wikiInfo.extract }}</template>
              <template v-else>Information not available.</template>
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

const API_BASE = 'http://localhost:3001'

const props = defineProps({ tripId: [String, Number] })
const router = useRouter()
const selections = useSelectionsStore()
const auth = useAuthStore()
const trip = computed(() => selections.items.find((t) => t.id == props.tripId))

// Fotos da viagem
const photos = ref([])
const fileInput = ref(null)

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
  // Abrir seletor de ficheiros para adicionar fotos
  triggerFileInput()
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
  width: 220px;
  height: 180px;
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
</style>
