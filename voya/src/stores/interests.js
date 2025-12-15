import { ref } from 'vue'
import { defineStore } from 'pinia'

function storageKeyFor(email) {
  return `voya_interests_${email}`
}

export const useInterestsStore = defineStore('interests', () => {
  const items = ref([])

  function load(email) {
    if (!email) {
      items.value = []
      return
    }
    try {
      const raw = localStorage.getItem(storageKeyFor(email))
      items.value = raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error('failed to load interests', e)
      items.value = []
    }
  }

  function save(email) {
    if (!email) return
    try {
      localStorage.setItem(storageKeyFor(email), JSON.stringify(items.value))
    } catch (e) {
      console.error('failed to save interests', e)
    }
  }

  function setInterests(interests, email) {
    items.value = [...interests]
    save(email)
  }

  function clear() {
    items.value = []
  }

  const count = ref(0)
  
  // Use a getter that updates count reactively
  function getCount() {
    return items.value.length
  }

  return {
    items,
    load,
    save,
    setInterests,
    clear,
    get count() {
      return items.value.length
    }
  }
})
