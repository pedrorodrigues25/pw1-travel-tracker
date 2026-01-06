<template>
  <div class="figma-journal-bg">
    <div class="figma-journal-container">
      <div v-if="destination">
        <div class="figma-journal-header">
          <button class="figma-back-btn" @click="$router.back()">←</button>
          <div class="figma-journal-title">
            {{ destination.city }}, {{ destination.country }}
          </div>
          <div class="figma-journal-tags">
            <span v-for="tag in destination.tags" :key="tag" class="tag-badge">{{ tag }}</span>
          </div>
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
            <div class="figma-journal-day-title">Sobre o destino</div>
            <div class="figma-journal-day-text">
              <template v-if="wikiLoading">A carregar informações...</template>
              <template v-else-if="wikiInfo">{{ wikiInfo.extract }}</template>
              <template v-else>Informações não disponíveis.</template>
            </div>
          </div>
        </div>
        <div class="figma-journal-polaroids">
          <template v-if="wikiImages.length">
            <div v-for="(img, idx) in wikiImages.slice(0, 8)" :key="idx" class="figma-polaroid">
              <img
                :src="img"
                alt="Foto do destino"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px"
              />
            </div>
          </template>
          <template v-else>
            <div v-for="n in 4" :key="n" class="figma-polaroid"></div>
          </template>
        </div>
        
        <!-- Botão para adicionar às viagens -->
        <div class="add-trip-section">
          <button class="add-trip-btn" @click="goToTrips">
            + Adicionar às minhas viagens
          </button>
        </div>
      </div>
      <div v-else class="journal-not-found">
        <p>Destino não encontrado.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCountryWikipediaSummary, fetchWikipediaImages } from '../api/countries'

const API_BASE = 'http://localhost:3001'

const props = defineProps({ 
  destinationId: {
    type: String,
    required: true
  }
})

const router = useRouter()
const destination = ref(null)
const wikiInfo = ref(null)
const wikiLoading = ref(false)
const wikiImages = ref([])

async function loadDestination() {
  try {
    const res = await fetch(`${API_BASE}/destinations/${props.destinationId}`)
    if (res.ok) {
      destination.value = await res.json()
    }
  } catch (e) {
    console.error('Erro ao carregar destino:', e)
  }
}

async function loadWikiInfo() {
  if (!destination.value) return
  
  const query = destination.value.city || destination.value.name
  if (query) {
    wikiLoading.value = true
    wikiInfo.value = null
    const result = await fetchCountryWikipediaSummary(query)
    if (!result.error) {
      wikiInfo.value = result
      wikiImages.value = await fetchWikipediaImages(query)
    }
    wikiLoading.value = false
  }
}

function goToTrips() {
  router.push('/trips')
}

onMounted(async () => {
  await loadDestination()
  await loadWikiInfo()
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
.figma-journal-title {
  font-size: 3rem;
  font-family: 'Amatic SC', cursive, sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
  margin-top: 12px;
  margin-bottom: 8px;
  color: #222;
}
.figma-journal-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 18px;
}
.tag-badge {
  background-color: #e8f4fc;
  color: #014f76;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
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
  flex-wrap: wrap;
}
.figma-polaroid {
  width: 120px;
  height: 140px;
  background: #e0dedb;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
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
.add-trip-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.add-trip-btn {
  background-color: #014f76;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.add-trip-btn:hover {
  background-color: #013a57;
}
</style>
