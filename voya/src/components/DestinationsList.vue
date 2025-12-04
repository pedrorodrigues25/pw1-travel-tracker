<template>
  <div class="destinations">
    <header class="dest-header">
      <h2>Escolher Destinos</h2>
      <div class="user-actions">
        <div class="user-info">
          <span class="user-email">{{ user.username || user.email }}</span>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ selections.count }}/10 viagens</span>
        </div>
        <button @click="logout" class="btn small">Logout</button>
      </div>
    </header>

    <section class="create">
      <label>Destino:</label>
      <select v-model="form.destination">
        <option disabled value="">-- selecione --</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>

      <label>Notas (opcional):</label>
      <input v-model="form.notes" placeholder="Notas sobre a viagem" />

      <button class="btn" @click="addSelection" :disabled="!form.destination">Guardar</button>
    </section>

    <section class="list">
      <h3>Minhas escolhas ({{ selections.count }})</h3>
      <ul>
        <li v-for="it in selections.items" :key="it.id">
          <div class="item-main">
            <strong>{{ it.destination }}</strong>
            <small>{{ new Date(it.createdAt).toLocaleString() }}</small>
          </div>
          <div class="item-notes">{{ it.notes }}</div>
          <div class="item-actions">
            <button class="btn small" @click="startEdit(it)">Editar</button>
            <button class="btn small danger" @click="remove(it.id)">Apagar</button>
          </div>
        </li>
      </ul>
      <div v-if="selections.count === 0">Ainda não guardaste nenhum destino.</div>
    </section>

    <section v-if="editing" class="edit-panel">
      <h3>Editar escolha</h3>
      <label>Destino:</label>
      <select v-model="editForm.destination">
        <option disabled value="">-- selecione --</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <label>Notas:</label>
      <input v-model="editForm.notes" />
      <div class="edit-actions">
        <button class="btn" @click="confirmEdit">Salvar</button>
        <button class="btn small" @click="cancelEdit">Cancelar</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()

const user = auth.user

const options = [
  'Lisboa, Portugal',
  'Porto, Portugal',
  'Funchal, Madeira',
  'Faro, Algarve',
  'Braga, Portugal',
]

const form = reactive({ destination: '', notes: '' })

const editing = ref(false)
const editId = ref(null)
const editForm = reactive({ destination: '', notes: '' })

// Computar o percentual de progresso (0-100%)
const progressPercentage = ref(0)

watch(
  () => selections.count,
  (count) => {
    progressPercentage.value = (count % 10) * 10
  },
  { immediate: true }
)

function ensureLoaded() {
  if (user && user.email) selections.load(user.email)
}

ensureLoaded()

watch(
  () => auth.user && auth.user.email,
  (val) => {
    if (val) selections.load(val)
  },
)

function addSelection() {
  if (!user || !user.email) return alert('Faz login primeiro')
  selections.add({ destination: form.destination, notes: form.notes }, user.email)
  form.destination = ''
  form.notes = ''
}

function startEdit(item) {
  editing.value = true
  editId.value = item.id
  editForm.destination = item.destination
  editForm.notes = item.notes || ''
}

function confirmEdit() {
  if (!editId.value) return
  selections.update(
    editId.value,
    { destination: editForm.destination, notes: editForm.notes },
    user.email,
  )
  cancelEdit()
}

function cancelEdit() {
  editing.value = false
  editId.value = null
  editForm.destination = ''
  editForm.notes = ''
}

function remove(id) {
  if (!confirm('Apagar esta escolha?')) return
  selections.remove(id, user.email)
}

function logout() {
  auth.logout()
  router.push('/login')
}

// save on unload (just in case)
window.addEventListener('beforeunload', () => {
  if (user && user.email) selections.save(user.email)
})
</script>

<style src="../css/DestinationsList.css"></style>
