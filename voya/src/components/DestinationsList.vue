<template>
  <div class="destinations">
    <header class="dest-header">
      <h2>Choose Destinations</h2>
      <div class="user-actions" v-if="!auth.isGuest">
        <div class="user-info">
          <span class="user-email clickable" @click="goToProfile">{{ user?.username || user?.email }}</span>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ selections.count }}/10 trips</span>
        </div>
        <button @click="logout" class="btn small">Logout</button>
      </div>
      <div class="user-actions" v-else>
        <span class="guest-badge">Guest Mode</span>
        <router-link to="/login" class="btn small btn-login">Log In</router-link>
      </div>
    </header>

    <!-- Alert for guests -->
    <div v-if="showLoginAlert" class="login-alert">
      <p>⚠️ You need to <router-link to="/login">log in</router-link> to save trips!</p>
      <button @click="showLoginAlert = false" class="close-alert">✕</button>
    </div>

    <section class="create">
      <label>Destination (Country):</label>
      <input
        v-model="countryQuery"
        @input="onCountryInput"
        @focus="onCountryInput"
        placeholder="Type a country..."
        autocomplete="off"
        class="country-search-input"
      />
      <ul v-if="showSuggestions && countryResults.length" class="country-suggestions">
        <li v-for="country in countryResults" :key="country.code" @click="selectCountry(country)">
          <img v-if="country.flag" :src="country.flag" alt="flag" class="country-flag" />
          {{ country.name }}
        </li>
      </ul>

      <label>Notes (optional):</label>
      <input v-model="form.notes" placeholder="Notes about the trip" />

      <label>Status:</label>
      <select v-model="form.status">
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <button class="btn" @click="addSelection" :disabled="!form.destination">Save</button>
    </section>

    <section class="list">
      <h3>My selections ({{ selections.count }})</h3>
      <div class="cards-container">
        <div v-for="it in selections.items" :key="it.id" class="trip-card">
          <div class="card-image clickable" @click="goToJournal(it.id)">
            <img :src="it.imageUrl || '/src/img/placeholder.jpg'" alt="Destination image" />
          </div>
          <div class="card-content">
            <div class="card-row card-title-row">
              <span class="card-title">{{ it.destination }}</span>
              <span class="card-status" :class="it.status === 'completed' ? 'completed' : 'upcoming'">
                {{ it.status === 'completed' ? 'Concluída' : 'Upcoming' }}
              </span>
            </div>
            <div class="card-row card-notes-row" v-if="it.notes">
              <span class="card-notes">{{ it.notes }}</span>
            </div>
            <div class="card-bottom-row">
              <span class="card-date">{{ new Date(it.createdAt).toLocaleString() }}</span>
              <div class="card-actions-row">
                <button class="btn small" @click="startEdit(it)">Edit</button>
                <button class="btn small danger" @click="remove(it.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selections.count === 0">You haven't saved any destinations yet.</div>
    </section>

    <section v-if="editing" class="edit-panel">
      <h3>Edit selection</h3>
      <label>Destination:</label>
      <div class="destination-search">
        <input
          v-model="countryQuery"
          @input="onCountryInput"
          placeholder="Search for a country..."
          class="country-input"
        />
        <div v-if="showSuggestions" class="suggestions-list">
          <div
            v-for="country in countryResults"
            :key="country.code"
            class="suggestion-item"
            @click="selectCountry(country)"
          >
            {{ country.name }}
          </div>
        </div>
      </div>
      <label>Notes:</label>
      <input v-model="editForm.notes" />
      <label>Status:</label>
      <select v-model="editForm.status">
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>
      <div class="edit-actions">
        <button class="btn" @click="confirmEdit">Save</button>
        <button class="btn small" @click="cancelEdit">Cancel</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { searchCountries } from '../api/countries'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()

const user = auth.user
const showLoginAlert = ref(false)

const form = reactive({ destination: '', notes: '', status: 'upcoming' })

const editing = ref(false)
const editId = ref(null)
const editForm = reactive({ destination: '', notes: '', status: 'upcoming' })

const countryQuery = ref('')
const countryResults = ref([])
const showSuggestions = ref(false)

// Compute the progress percentage (0-100%)
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



async function onCountryInput() {
  if (countryQuery.value.length < 2) {
    countryResults.value = []
    showSuggestions.value = false
    return
  }
  countryResults.value = await searchCountries(countryQuery.value)
  showSuggestions.value = true
}

function selectCountry(country) {
  form.destination = country.name
  countryQuery.value = country.name
  showSuggestions.value = false
}

document.addEventListener('click', (e) => {
  // Fecha sugestões se clicar fora do input ou lista
  const input = document.querySelector('.country-search-input');
  const list = document.querySelector('.country-suggestions');
  if (input && !input.contains(e.target) && list && !list.contains(e.target)) {
    showSuggestions.value = false;
  }
});

function addSelection() {
  if (!form.destination) {
    alert('Escolhe um país!')
    return
  }
  // If guest, show alert
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  if (!user || !user.email) return alert('Please log in first')
  selections.add({ destination: form.destination, notes: form.notes, status: form.status }, user.email)
  form.destination = ''
  form.notes = ''
  form.status = 'upcoming'
  countryQuery.value = ''
}

function startEdit(item) {
  // If guest, show alert
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  editing.value = true
  editId.value = item.id
  editForm.destination = item.destination
  editForm.notes = item.notes || ''
  editForm.status = item.status || 'upcoming'
}

function confirmEdit() {
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  if (!editId.value) return
  selections.update(
    editId.value,
    { destination: editForm.destination, notes: editForm.notes, status: editForm.status },
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
  // If guest, show alert
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  if (!confirm('Delete this selection?')) return
  selections.remove(id, user.email)
}

function logout() {
  auth.logout()
  router.push('/login')
}

function goToProfile() {
  router.push('/profile')
}

function goToJournal(tripId) {
  router.push({ name: 'Journal', params: { tripId } })
}

// save on unload (just in case)
window.addEventListener('beforeunload', () => {
  if (user && user.email) selections.save(user.email)
})
</script>

<style src="../css/DestinationsList.css"></style>
<style scoped>
.country-search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
}
.country-suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-height: 180px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 90%;
}
.country-suggestions li {
  padding: 7px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.country-suggestions li:hover {
  background: #f0f4fa;
}
.country-flag {
  width: 22px;
  height: 16px;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: 0 1px 2px #0001;
}
</style>
