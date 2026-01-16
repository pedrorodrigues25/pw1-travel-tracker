<template>
  <Teleport to="body">
    <Transition name="badge-notification">
      <div v-if="show" class="badge-notification-overlay" @click.self="close">
        <div class="badge-notification-modal">
          <div class="confetti-container">
            <div class="confetti" v-for="i in 50" :key="i" :style="confettiStyle(i)"></div>
          </div>
          
          <button class="close-btn" @click="close">&times;</button>
          
          <div class="notification-content">
            <div class="celebration-icon">🎉</div>
            <h2 class="notification-title">Parabéns!</h2>
            <p class="notification-subtitle">Conquistaste uma nova badge!</p>
            
            <div class="badge-display">
              <img :src="badgeImageUrl" :alt="badge?.name" class="badge-image" />
            </div>
            
            <h3 class="badge-name">{{ badge?.name }}</h3>
            <p class="badge-description">{{ badge?.description }}</p>
            
            <button class="continue-btn" @click="close">Continuar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useBadgesStore } from '../stores/badges'

const badgesStore = useBadgesStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const badgeImageUrl = computed(() => {
  if (!props.badge) return ''
  return badgesStore.getBadgeImageUrl(props.badge.image)
})

function close() {
  emit('close')
}

// Generate random confetti styles
function confettiStyle(index) {
  const colors = ['#f5a85c', '#0d5678', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3']
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 2 + Math.random() * 2
  const size = 6 + Math.random() * 6
  const color = colors[index % colors.length]
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
  }
}
</script>

<style scoped>
.badge-notification-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.badge-notification-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalPop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;
}

.close-btn:hover {
  color: #333;
}

.confetti-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: confettiFall linear infinite;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(500px) rotate(720deg);
    opacity: 0;
  }
}

.notification-content {
  position: relative;
  z-index: 1;
}

.celebration-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.notification-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0d5678;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.notification-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 24px 0;
}

.badge-display {
  width: 140px;
  height: 140px;
  margin: 0 auto 24px;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.badge-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(13, 86, 120, 0.3));
}

.badge-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0d5678;
  margin: 0 0 8px 0;
}

.badge-description {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.continue-btn {
  background: linear-gradient(135deg, #f5a85c 0%, #f9b77a 100%);
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 168, 92, 0.4);
}

/* Transition animations */
.badge-notification-enter-active,
.badge-notification-leave-active {
  transition: opacity 0.3s ease;
}

.badge-notification-enter-from,
.badge-notification-leave-to {
  opacity: 0;
}

.badge-notification-enter-from .badge-notification-modal,
.badge-notification-leave-to .badge-notification-modal {
  transform: scale(0.8);
}
</style>
