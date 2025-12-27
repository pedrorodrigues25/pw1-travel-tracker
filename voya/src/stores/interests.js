
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getInterests, saveInterest } from '../api/api'

export const useInterestsStore = defineStore('interests', () => {
  const items = ref([])

  async function load(email) {
    if (!email) {
      items.value = []
      return
    }
    try {
      items.value = await getInterests(email)
    } catch (e) {
      console.error('failed to load interests', e)
      items.value = []
    }
  }

  // save removido, agora é feito via API

  async function setInterests(interests, email) {
    if (!email) return
    items.value = [...interests]
    for (const interest of interests) {
      await saveInterest({ interest })
    }
  }

  function clear() {
    items.value = []
    // TODO: implementar clear via API
  }

  return {
    items,
    load,
    setInterests,
    clear,
    get count() {
      return items.value.length
    }
  }
})
