<template>
  <div v-if="!isLogged">
    <router-view />
  </div>
  <div v-else>
    <Destinations />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Destinations from './components/DestinationsList.vue'

const auth = useAuthStore()

const isLogged = computed(() => !!(auth.user && auth.user.email))
</script>

<style src="./style.css"></style>
