<template>
  <div class="destinations">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </router-link>
      <div class="navbar-links">
        <router-link to="/destinations" active-class="active">Home</router-link>
        <a href="#" class="navbar-link">Recommendations</a>
        <a href="#" class="navbar-link">Trips</a>
        <a href="#" class="navbar-link">Friends</a>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>
    <h2 style="margin-top: 18px;">Choose Destinations</h2>

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

      <label v-if="form.destination">City:</label>
      <input v-if="form.destination"
        v-model="form.city"
        @focus="showCitySuggestions = true"
        placeholder="Type or select a city..."
        autocomplete="off"
        class="city-search-input"
      />
      <ul v-if="showCitySuggestions && cityResults.length" class="city-suggestions">
        <li v-for="city in cityResults" :key="city" @click="selectCity(city)">{{ city }}</li>
      </ul>

      <label>Notes (optional):</label>
      <input v-model="form.notes" placeholder="Notes about the trip" />

      <label>Status:</label>
      <select v-model="form.status">
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <label>Start Date:</label>
      <input type="date" v-model="form.startDate" required />
      <label>End Date:</label>
      <input type="date" v-model="form.endDate" required />

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
              <span class="card-title">
                <template v-if="it.city">{{ it.city }}, {{ it.destination }}</template>
                <template v-else>{{ it.destination }}</template>
              </span>
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
import { fetchCountryWikipediaSummary } from '../api/countries'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()

const user = auth.user
const showLoginAlert = ref(false)

const form = reactive({ destination: '', city: '', notes: '', status: 'upcoming', startDate: '', endDate: '' })

const editing = ref(false)
const editId = ref(null)
const editForm = reactive({ destination: '', notes: '', status: 'upcoming' })

const countryQuery = ref('')
const countryResults = ref([])
const showSuggestions = ref(false)

const cityResults = ref([])
const showCitySuggestions = ref(false)

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

// Função para buscar cidades de um país via Wikidata
async function searchCities(countryName) {
  const endpoint = 'https://query.wikidata.org/sparql'
  const query = `SELECT ?cityLabel WHERE { ?country rdfs:label "${countryName}"@en. ?city wdt:P31/wdt:P279* wd:Q515; wdt:P17 ?country. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 50`
  const url = endpoint + '?query=' + encodeURIComponent(query) + '&format=json'
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.results.bindings.map(b => b.cityLabel.value)
  } catch (e) {
    return []
  }
}

async function selectCountry(country) {
  form.destination = country.name
  countryQuery.value = country.name
  showSuggestions.value = false
  // Buscar cidades únicas
  const allCities = await searchCities(country.name)
  cityResults.value = Array.from(new Set(allCities))
  showCitySuggestions.value = true
}

function selectCity(city) {
  form.city = city
  showCitySuggestions.value = false
}

document.addEventListener('click', (e) => {
  // Fecha sugestões se clicar fora do input ou lista
  const input = document.querySelector('.country-search-input');
  const list = document.querySelector('.country-suggestions');
  if (input && !input.contains(e.target) && list && !list.contains(e.target)) {
    showSuggestions.value = false;
  }
});

async function addSelection() {
  if (!form.destination) {
    alert('Escolhe um país!')
    return
  }
  if (!form.startDate || !form.endDate) {
    alert('Preencha as datas de início e fim!')
    return
  }
  // If guest, show alert
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  if (!user || !user.email) return alert('Please log in first')
  // Buscar imagem da Wikipedia
  let wikiQuery = form.city || form.destination
  let imageUrl = ''
  try {
    const wikiResult = await fetchCountryWikipediaSummary(wikiQuery)
    imageUrl = wikiResult?.originalimage?.source || ''
  } catch {}
  selections.add({ destination: form.destination, city: form.city, notes: form.notes, status: form.status, startDate: form.startDate, endDate: form.endDate, imageUrl }, user.email)
  form.destination = ''
  form.city = ''
  form.notes = ''
  form.status = 'upcoming'
  form.startDate = ''
  form.endDate = ''
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

async function getWikiImage(query) {
  const result = await fetchCountryWikipediaSummary(query)
  return result?.originalimage?.source || '/src/img/placeholder.jpg'
}
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
  width: 350px;
  min-width: 220px;
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
.city-search-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
}
.city-suggestions {
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
  width: 350px;
  min-width: 220px;
}
.city-suggestions li {
  padding: 7px 12px;
  cursor: pointer;
}
.city-suggestions li:hover {
  background: #f0f4fa;
}
select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 4px;
  background: #fff;
  color: #222;
}
</style>
