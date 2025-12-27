<template>
  <Journal :tripId="tripId" />
</template>

<script setup>
import Journal from '../components/Journal.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const tripId = route.params.tripId
</script>
