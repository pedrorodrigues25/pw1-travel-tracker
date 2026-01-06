<template>
  <DestinationDetailPage :destinationId="destinationId" />
</template>

<script setup>
import DestinationDetailPage from '../components/DestinationDetailPage.vue'

defineProps({
  destinationId: {
    type: String,
    required: true
  }
})
</script>
