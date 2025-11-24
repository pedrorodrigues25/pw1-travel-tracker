import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

function storageKeyFor(email) {
  return `voya_selections_${email}`
}

export const useSelectionsStore = defineStore('selections', () => {
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
      console.error('failed to load selections', e)
      items.value = []
    }
  }

  function save(email) {
    if (!email) return
    try {
      localStorage.setItem(storageKeyFor(email), JSON.stringify(items.value))
    } catch (e) {
      console.error('failed to save selections', e)
    }
  }

  function add(selection, email) {
    const id = Date.now().toString()
    items.value.push({ id, ...selection, createdAt: new Date().toISOString() })
    save(email)
  }

  function update(id, patch, email) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...patch }
      save(email)
    }
  }

  function remove(id, email) {
    items.value = items.value.filter((i) => i.id !== id)
    save(email)
  }

  function clear(email) {
    items.value = []
    save(email)
  }

  const count = computed(() => items.value.length)

  return { items, count, load, save, add, update, remove, clear }
})
