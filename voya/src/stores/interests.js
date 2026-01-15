
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
      const all = await getInterests(email)
      items.value = all.filter(i => i.userEmail === email)
    } catch (e) {
      console.error('failed to load interests', e)
      items.value = []
    }
  }

  async function setInterests(interests, email) {
    if (!email) return
    // 1. Carregar interesses antigos do utilizador
    const antigos = await getInterests(email)
    // 2. Apagar todos os interesses antigos (DELETE por id)
    for (const antigo of antigos) {
      if (antigo.id) {
        await fetch(`http://localhost:3001/interests/${antigo.id}`, { method: 'DELETE' })
      }
    }
    // 3. Guardar os novos interesses, cada um com id único, interest e userEmail
    items.value = []
    for (const interest of interests) {
      const obj = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
        interest,
        userEmail: email
      }
      const saved = await saveInterest(obj)
      if (saved) items.value.push(saved)
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
