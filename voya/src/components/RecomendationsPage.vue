<template>
  <div class="recommendations-page">
    <!-- Navbar -->
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

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-container">
        <button 
          v-for="interest in availableInterests" 
          :key="interest"
          :class="['filter-tag', { active: selectedFilters.includes(interest) }]"
          @click="toggleFilter(interest)"
        >
          <span class="filter-icon">{{ selectedFilters.includes(interest) ? '✕' : '+' }}</span>
          {{ interest }}
        </button>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="recommendations-content">
      <h2 class="section-title">TRIPS JUST FOR YOU</h2>
      
      <div class="recommendations-grid">
        <div 
          v-for="destination in filteredRecommendations" 
          :key="destination.id"
          class="recommendation-card"
        >
          <div class="card-image" :style="{ backgroundImage: `url(${destination.photo || 'https://via.placeholder.com/400x300'})` }">
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ destination.city }}, {{ destination.country }}</h3>
            <p class="card-description">{{ destination.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }}</p>
            <button class="card-button">
              <span class="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredRecommendations.length === 0" class="no-recommendations">
        <p>No recommendations available for your selected interests</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useInterestsStore } from '../stores/interests'

const auth = useAuthStore()
const interestsStore = useInterestsStore()
const recommendations = ref([])
const selectedFilters = ref([])

const availableInterests = [
  'Traveling with Friends',
  'Solo Adventure',
  'Family Trips',
  'Beach & Relaxation',
  'City Exploration',
  'Nature & Hiking',
  'Cultural Experiences',
  'Food & Gastronomy',
  'Photography',
  'Road Trips'
]

async function loadUserInterests() {
  const userEmail = auth.user?.email
  if (userEmail) {
    await interestsStore.load(userEmail)
    // Extrair apenas os nomes dos interesses
    selectedFilters.value = interestsStore.items.map(item => item.interest)
  }
}

async function loadRecommendations() {
  try {
    const userEmail = auth.user?.email
    const response = await fetch(userEmail ? `/api/recommendations?userEmail=${encodeURIComponent(userEmail)}` : '/api/recommendations')
    if (response.ok) {
      recommendations.value = await response.json()
    }
  } catch (e) {
    console.error('Erro ao carregar recomendações:', e)
  }
}

const filteredRecommendations = computed(() => {
  if (selectedFilters.value.length === 0) {
    return recommendations.value
  }
  return recommendations.value.filter(dest =>
    dest.tags && dest.tags.some(tag => selectedFilters.value.includes(tag))
  )
})

function toggleFilter(interest) {
  const index = selectedFilters.value.indexOf(interest)
  if (index === -1) {
    selectedFilters.value.push(interest)
  } else {
    selectedFilters.value.splice(index, 1)
  }
}

onMounted(async () => {
  await loadUserInterests()
  await loadRecommendations()
})
</script>

<style src="../css/NavBar.css"></style>
<style scoped>
.recommendations-page {
  min-height: 100vh;
  background-color: #b8c9d9;
  padding-bottom: 40px;
}

/* Filters Section */
.filters-section {
  background-color: #b8c9d9;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.filters-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
  align-items: center;
}

.filter-tag {
  padding: 8px 16px;
  border: 1px solid #666;
  background-color: #ffffff;
  color: #333;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-icon {
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.filter-tag:hover {
  background-color: #f0f4fa;
  border-color: #0077ff;
}

.filter-tag.active {
  background-color: #0077ff;
  color: #ffffff;
  border-color: #0077ff;
  font-weight: 600;
}

/* Recommendations Content */
.recommendations-content {
  padding: 40px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 32px;
  text-align: left;
}

/* Grid of Recommendations */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Individual Card */
.recommendation-card {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.recommendation-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Card Image */
.card-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
}

/* Card Content */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  flex-grow: 1;
}

/* Card Button */
.card-button {
  align-self: flex-start;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0077ff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.card-button:hover {
  background-color: #005cbf;
  transform: scale(1.1);
}

.button-icon {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
}

/* No Recommendations */
.no-recommendations {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-recommendations p {
  font-size: 16px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .filters-container {
    gap: 8px;
  }

  .filter-tag {
    font-size: 12px;
    padding: 6px 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .card-title {
    font-size: 14px;
  }

  .card-description {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .recommendations-content {
    padding: 20px 12px;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filters-container {
    gap: 6px;
  }

  .filter-tag {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>