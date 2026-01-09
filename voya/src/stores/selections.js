
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getSelections, saveSelection, deleteSelection } from '../api/api'

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
  }

  // update pode ser implementado via API se necessário
  function update(id, patch) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...patch }
      // TODO: implementar PATCH via API
    }
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
    // TODO: implementar clear via API
  }

  const count = computed(() => items.value.length)

  return { items, count, load, add, update, remove, clear }
})
