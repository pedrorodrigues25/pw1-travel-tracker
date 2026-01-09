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
            <div class="figma-journal-day-title">About the destination</div>
            <div class="figma-journal-day-text">
              <template v-if="wikiLoading">Loading information...</template>
              <template v-else-if="wikiInfo">{{ wikiInfo.extract }}</template>
              <template v-else>Information not available.</template>
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
            + Add to My Trips
          </button>
        </div>
      </div>
      <div v-else class="journal-not-found">
        <p>Destination not found.</p>
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

<style src="../css/DestinationDetailPage.css"></style>
