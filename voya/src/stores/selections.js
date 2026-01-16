
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getSelections, saveSelection, deleteSelection, updateSelection } from '../api/api'

export const useSelectionsStore = defineStore('selections', () => {
  const items = ref([])

  async function load(email) {
    if (!email) {
      items.value = []
      return
    }
    try {
      items.value = await getSelections(email)
    } catch (e) {
      console.error('failed to load selections', e)
      items.value = []
    }
  }

  // save removido, agora é feito via API

  async function add(selection, email) {
    if (!email) return
    const newSelection = {
      ...selection,
      userEmail: email,
      createdAt: new Date().toISOString()
    }
    const saved = await saveSelection(newSelection)
    if (saved) items.value.push(saved)
    return saved
  }

  // update via API
  async function update(id, patch) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      const updated = await updateSelection(id, patch)
      if (updated) {
        items.value[idx] = { ...items.value[idx], ...updated }
        return updated
      }
    }
    return null
  }

  async function remove(id) {
    if (!id) return false
    const deleted = await deleteSelection(id)
    if (deleted) {
      items.value = items.value.filter((i) => i.id !== id)
    }
    return deleted
  }

  function clear() {
    items.value = []
  }

  const count = computed(() => items.value.length)

  return { items, count, load, add, update, remove, clear }
})
