<template>
  <div class="figma-journal-bg">
    <div class="figma-journal-container">
      <div v-if="trip && trip.destination">
        <div class="figma-journal-header">
          <button class="figma-back-btn" @click="$router.back()">←</button>
          <div class="figma-journal-title">{{ trip.destination || 'Destino' }}</div>
          <div class="figma-journal-dates">
            {{ trip.startDate || '21/07/2025' }} - {{ trip.endDate || '26/07/2025' }}
          </div>
          <div class="figma-journal-avatars">
            <img v-for="n in 5" :key="n" :src="`/src/img/avatar${n}.png`" class="figma-avatar" alt="avatar" />
          </div>
        </div>
        <div class="figma-journal-main">
          <div class="figma-journal-image-block"></div>
          <div class="figma-journal-day-block">
            <div class="figma-journal-day-title">1st day</div>
            <div class="figma-journal-day-text">
              {{ trip.notes || 'The adventure officially begins! Arrived to sunny (and slightly chaotic) London with the best crew ever. Feeling the zest of the city already. We checked into our posh pad, immediately dove into the streets, snacking to half chance (we finished so many memories to make that have cities to revisit, lots of cheering, laughing, and getting totally lost together. The journey starts now!)' }}
            </div>
          </div>
        </div>
        <div class="figma-journal-polaroids">
          <div v-for="n in 4" :key="n" class="figma-polaroid"></div>
        </div>
      </div>
      <div v-else class="journal-not-found">
        <p>Viagem não encontrada.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'TripJournal' })
import { computed } from 'vue'
import { useSelectionsStore } from '../stores/selections'
const props = defineProps({ tripId: [String, Number] })
const selections = useSelectionsStore()
const trip = computed(() => selections.items.find(t => t.id == props.tripId))
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
  margin-bottom: 0;
  color: #222;
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
</style>
