<template>
  <div class="interests-container">
    <!-- Left Panel - Destination Image -->
    <div class="destination-panel">
      <div class="destination-content">
        <h2 class="destination-title">NOME DO DESTINO</h2>
        <p class="destination-caption">Depois uma legenda bonita do destino</p>
      </div>
    </div>

    <!-- Right Panel - Interests Selection -->
    <div class="interests-card">
      <img src="/src/img/Vector.png" alt="Decorative flight vector" class="vector-art-interests" />
      
      <h2 class="interests-title">Add your interests</h2>

      <div class="interests-tags">
        <button 
          v-for="interest in availableInterests" 
          :key="interest"
          :class="['interest-tag', { selected: selectedInterests.includes(interest) }]"
          @click="toggleInterest(interest)"
        >
          {{ interest }}
        </button>
      </div>

      <button class="continue-btn" @click="handleContinue">Continue</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const selectedInterests = ref([])

function toggleInterest(interest) {
  const index = selectedInterests.value.indexOf(interest)
  if (index === -1) {
    selectedInterests.value.push(interest)
  } else {
    selectedInterests.value.splice(index, 1)
  }
}

function handleContinue() {
  // Save interests to user profile if needed
  // For now, just navigate to destinations
  router.push('/destinations')
}
</script>

<style src="../css/InterestsForm.css"></style>
