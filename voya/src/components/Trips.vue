<template>
  <div class="trips-container">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </router-link>
      <div class="navbar-links">
        <router-link to="/homepage" active-class="active">Home</router-link>
        <router-link to="/recommendations" active-class="active">Recommendations</router-link>
        <router-link to="/trips" active-class="active">Trips</router-link>
        <router-link to="/friends" active-class="active">Friends</router-link>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>
    <div class="trips-main">
      <h2 class="voya-section-title">Choose Destinations</h2>
      <!-- Conteúdo principal da antiga DestinationsList.vue -->
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
        <input
          v-if="form.destination"
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
        <label>Start Date:</label>
        <input type="date" v-model="form.startDate" required />
        <label>End Date:</label>
        <input type="date" v-model="form.endDate" :min="form.startDate" required />
        
        <!-- Friends Selection -->
        <label>Travel with friends (optional):</label>
        <div class="friends-selection">
          <div v-if="userFriends.length" class="friends-search-container">
            <!-- Selected friends bubbles -->
            <div v-if="selectedFriends.length" class="selected-friends-bubbles">
              <div
                v-for="friendId in selectedFriends"
                :key="friendId"
                class="selected-friend-bubble"
                @click="removeFriend(friendId)"
                :title="getFriendById(friendId)?.username + ' (click to remove)'"
              >
                {{ getFriendById(friendId)?.username?.charAt(0).toUpperCase() || '?' }}
                <span class="remove-x">×</span>
              </div>
            </div>
            
            <!-- Search input -->
            <div class="friends-search-wrapper">
              <input
                v-model="friendSearchQuery"
                type="text"
                class="friends-search-input"
                placeholder="Search your friends..."
                @focus="showFriendsDropdown = true"
              />
              <!-- Dropdown results -->
              <div v-if="showFriendsDropdown && friendSearchQuery" class="friends-dropdown">
                <div
                  v-for="friend in filteredUserFriends"
                  :key="friend.id"
                  class="friend-dropdown-item"
                  :class="{ selected: selectedFriends.includes(friend.id) }"
                  @click="toggleFriendSelection(friend.id)"
                >
                  <span class="friend-dropdown-avatar">
                    {{ friend.username?.charAt(0).toUpperCase() || '?' }}
                  </span>
                  <span class="friend-dropdown-name">{{ friend.username }}</span>
                  <span v-if="selectedFriends.includes(friend.id)" class="friend-check">✓</span>
                </div>
                <p v-if="filteredUserFriends.length === 0" class="no-results-msg">
                  No friends found
                </p>
              </div>
            </div>
          </div>
          <p v-else class="no-friends-msg">No friends added yet. Add friends in the Friends page.</p>
        </div>
        
        <button class="btn" @click="addSelection" :disabled="!form.destination">Save</button>
      </section>
      <section class="list">
        <h3>My selections ({{ activeTripCount }})</h3>
        <div class="cards-container">
          <div v-for="it in activeTrips" :key="it.id" class="trip-card">
            <div class="card-icons"></div>
            <div class="trip-cover">
              <img v-if="it.imageUrl" :src="it.imageUrl" :alt="it.city || it.destination" />
              <div v-else class="trip-cover-placeholder"></div>
            </div>
            <div class="trip-info">
              <div class="trip-title-row">
                <h4 class="trip-title">
                  <template v-if="it.city">{{ it.city }}, {{ it.destination }}</template>
                  <template v-else>{{ it.destination }}</template>
                </h4>
                <span class="trip-status pill" :class="it.status">{{
                  it.status === 'completed' ? 'Completed' : 'Upcoming'
                }}</span>
              </div>
              <div class="trip-date">{{ formatMonthYear(it.startDate || it.createdAt) }}</div>
              <div class="trip-updates">
                {{ getUpdatesCount(it) }} New Update{{ getUpdatesCount(it) !== 1 ? 's' : '' }}
              </div>
              <div v-if="it.friends && it.friends.length" class="trip-avatars">
                <span
                  class="avatar tiny"
                  v-for="friendId in it.friends.slice(0, 5)"
                  :key="friendId"
                  :title="getFriendName(friendId)"
                  >{{ getFriendInitial(friendId) }}</span
                >
              </div>
            </div>
            <div class="trip-actions">
              <button class="open-journal-btn pill" @click="goToJournal(it.id)">
                Open the Journal
              </button>
            </div>
          </div>
        </div>
        <div v-if="activeTripCount === 0">You haven't saved any destinations yet.</div>
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
  </div>

  <!-- Badge Notification -->
  <BadgeNotification
    :show="badgesStore.showNotification"
    :badge="badgesStore.newBadge"
    @close="badgesStore.closeNotification()"
  />
</template>

<script setup>
// @vue/component
defineOptions({ name: 'TripsPage' })
import { reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useSelectionsStore } from '../stores/selections'
import { useBadgesStore } from '../stores/badges'
import { searchCountries } from '../api/countries'
import { fetchCountryWikipediaSummary } from '../api/countries'
import { getFriends, getUserFriends } from '../api/api'
import BadgeNotification from './BadgeNotification.vue'

const router = useRouter()
const auth = useAuthStore()
const selections = useSelectionsStore()
const badgesStore = useBadgesStore()

const user = auth.user
const showLoginAlert = ref(false)

// Friends data for avatar display
const allFriends = ref([])
// User's added friends for trip creation
const userFriends = ref([])
// Search query for friends
const friendSearchQuery = ref('')
const showFriendsDropdown = ref(false)

async function loadFriends() {
  try {
    allFriends.value = await getFriends()
    // Load user's added friends
    if (user?.email) {
      userFriends.value = await getUserFriends(user.email)
    }
  } catch (e) {
    console.error('Error loading friends:', e)
  }
}

// Filtered friends based on search query
const filteredUserFriends = computed(() => {
  if (!friendSearchQuery.value.trim()) {
    return userFriends.value
  }
  const query = friendSearchQuery.value.toLowerCase()
  return userFriends.value.filter(friend => 
    friend.username?.toLowerCase().includes(query) ||
    friend.email?.toLowerCase().includes(query)
  )
})

// Toggle friend selection
function toggleFriendSelection(friendId) {
  const idx = selectedFriends.value.indexOf(friendId)
  if (idx === -1) {
    selectedFriends.value.push(friendId)
  } else {
    selectedFriends.value.splice(idx, 1)
  }
  friendSearchQuery.value = ''
  showFriendsDropdown.value = false
}

// Remove friend from selection
function removeFriend(friendId) {
  const idx = selectedFriends.value.indexOf(friendId)
  if (idx !== -1) {
    selectedFriends.value.splice(idx, 1)
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.friends-search-wrapper')
  if (wrapper && !wrapper.contains(e.target)) {
    showFriendsDropdown.value = false
  }
})

loadFriends()

function getFriendById(friendId) {
  return allFriends.value.find((f) => f.id === friendId)
}

function getFriendInitial(friendId) {
  const friend = getFriendById(friendId)
  if (friend && friend.username) {
    return friend.username.charAt(0).toUpperCase()
  }
  return '?'
}

function getFriendName(friendId) {
  const friend = getFriendById(friendId)
  return friend?.username || 'Unknown'
}

// Conta updates de uma viagem (fotos, customText, etc.)
function getUpdatesCount(trip) {
  let count = 0
  // Conta fotos
  if (trip.photos && Array.isArray(trip.photos)) {
    count += trip.photos.length
  }
  // Conta customText como 1 update se existir
  if (trip.customText && trip.customText.trim()) {
    count += 1
  }
  // Conta entradas de journal se existirem
  if (trip.journalEntries && Array.isArray(trip.journalEntries)) {
    count += trip.journalEntries.length
  }
  return count
}

// Filter out archived trips from display
const activeTrips = computed(() => selections.items.filter((t) => !t.archived))
const activeTripCount = computed(() => activeTrips.value.length)

const form = reactive({
  destination: '',
  city: '',
  notes: '',
  startDate: '',
  endDate: '',
})

// Selected friends for new trip
const selectedFriends = ref([])

// Unused edit state - kept for potential future use
// const editing = ref(false)
// const editId = ref(null)
// const editForm = reactive({ destination: '', notes: '', status: 'upcoming' })

const countryQuery = ref('')
const countryResults = ref([])
const showSuggestions = ref(false)

const cityResults = ref([])
const showCitySuggestions = ref(false)

watch(
  () => selections.count,
  () => {},
  { immediate: true },
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

async function searchCities(countryName) {
  const endpoint = 'https://query.wikidata.org/sparql'
  const query = `SELECT ?cityLabel WHERE { ?country rdfs:label "${countryName}"@en. ?city wdt:P31/wdt:P279* wd:Q515; wdt:P17 ?country. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 50`
  const url = endpoint + '?query=' + encodeURIComponent(query) + '&format=json'
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.results.bindings.map((b) => b.cityLabel.value)
  } catch {
    return []
  }
}

async function selectCountry(country) {
  form.destination = country.name
  countryQuery.value = country.name
  showSuggestions.value = false
  const allCities = await searchCities(country.name)
  cityResults.value = Array.from(new Set(allCities))
  showCitySuggestions.value = true
}

function selectCity(city) {
  form.city = city
  showCitySuggestions.value = false
}

document.addEventListener('click', (e) => {
  const input = document.querySelector('.country-search-input')
  const list = document.querySelector('.country-suggestions')
  if (input && !input.contains(e.target) && list && !list.contains(e.target)) {
    showSuggestions.value = false
  }
})

async function addSelection() {
  if (!form.destination) {
    alert('Escolhe um país!')
    return
  }
  if (!form.startDate || !form.endDate) {
    alert('Preencha as datas de início e fim!')
    return
  }
  if (auth.isGuest) {
    showLoginAlert.value = true
    return
  }
  if (!user || !user.email) return alert('Please log in first')
  let wikiQuery = form.city || form.destination
  let imageUrl = ''
  try {
    const wikiResult = await fetchCountryWikipediaSummary(wikiQuery)
    imageUrl = wikiResult?.originalimage?.source || ''
  } catch (e) {
    console.error(e)
  }
  // Calcular status automaticamente com base na data de fim
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDateObj = new Date(form.endDate)
  endDateObj.setHours(0, 0, 0, 0)
  const status = endDateObj <= today ? 'completed' : 'upcoming'

  const newTrip = await selections.add(
    {
      destination: form.destination,
      city: form.city,
      notes: form.notes,
      status,
      startDate: form.startDate,
      endDate: form.endDate,
      imageUrl,
      friends: selectedFriends.value.length > 0 ? [...selectedFriends.value] : [],
    },
    user.email,
  )

  // Check for new badges after adding a trip
  if (newTrip && user.email) {
    badgesStore.loadBadges(user.email)
    badgesStore.checkBadges(selections.items, user.email)
  }

  // Reset form
  selectedFriends.value = []

  form.destination = ''
  form.city = ''
  form.notes = ''
  form.startDate = ''
  form.endDate = ''
  countryQuery.value = ''
}

function goToJournal(tripId) {
  router.push({ name: 'Journal', params: { tripId } })
}

function formatMonthYear(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

window.addEventListener('beforeunload', () => {
  if (user && user.email) selections.save(user.email)
})
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/Trips.css"></style>
