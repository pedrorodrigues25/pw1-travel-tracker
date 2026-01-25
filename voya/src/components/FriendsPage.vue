<template>
  <div class="friends-container">
    <nav class="navbar">
      <a class="navbar-logo" @click.prevent="showLogoutModal = true" style="cursor: pointer">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </a>
      <div class="navbar-links">
        <router-link to="/homepage" active-class="active">Home</router-link>
        <router-link to="/recommendations" active-class="active">Recommendations</router-link>
        <router-link to="/trips" active-class="active">Trips</router-link>
        <router-link to="/friends" active-class="active">Friends</router-link>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>

    <div class="friends-main">
      <!-- See where your friends are -->
      <section class="friends-locations">
        <h2 class="voya-section-title">See where your friends are</h2>
        <div class="friend-cards">
          <div v-for="friend in friends" :key="friend.id" class="friend-card">
            <div class="friend-card-header">
              <div class="friend-avatar">
                <img v-if="friend.photo" :src="friend.photo" :alt="friend.username" />
                <div v-else class="avatar-placeholder">
                  {{ friend.username.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="friend-info">
                <h3 class="friend-name">{{ friend.name || friend.username }}</h3>
                <p class="friend-username">@{{ friend.username }}</p>
              </div>
            </div>
            <div class="friend-card-body">
              <div v-if="friend.trips && friend.trips.length > 0" class="friend-trips-list">
                <div v-for="(trip, index) in friend.trips.slice(0, 3)" :key="index" class="friend-trip-item">
                  <div class="friend-trip-circle">
                    <span>{{ (trip.city || trip.destination).charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="friend-trip-info">
                    <span class="friend-trip-destination">{{ trip.city || trip.destination }}</span>
                    <span class="friend-trip-dates">{{ formatTripDates(trip.startDate, trip.endDate) }}</span>
                  </div>
                  <span class="friend-trip-status" :class="trip.status">{{ trip.status }}</span>
                </div>
              </div>
              <div v-else class="no-trip-placeholder">
                <span>No trips yet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Your trips with friends -->
      <section class="shared-trips">
        <h2>Your trips with friends</h2>
        <div class="trips-cards">
          <div
            v-for="trip in sharedTrips"
            :key="trip.id"
            class="trip-card-small clickable"
            @click="goToJournal(trip.id)"
            style="cursor: pointer"
          >
            <div class="trip-image">
              <img v-if="trip.imageUrl" :src="trip.imageUrl" :alt="trip.destination" />
              <div v-else class="image-placeholder"></div>
            </div>
            <div class="trip-details">
              <h4>{{ trip.city || trip.destination }}</h4>
              <span class="trip-status" :class="trip.status">{{ trip.status }}</span>
              <p v-if="trip.notes" class="trip-notes">{{ trip.notes }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- People you may know -->
      <section class="recommendations">
        <div class="recommendations-header">
          <h2>People you may know</h2>
          <button class="refresh-btn" @click="refreshRecommendations" title="Show different people">
            ↻
          </button>
        </div>
        <div class="recommendations-grid">
          <div v-for="person in recommendationsToShow" :key="person.id" class="person-card">
            <div class="person-card-top"></div>
            <div class="person-card-body">
              <div class="person-avatar large">
                <img v-if="person.photo" :src="person.photo" :alt="person.username" />
                <div v-else class="avatar-placeholder">
                  {{ person.username.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="person-info">
                <h4>{{ person.name || person.username }}</h4>
                <p class="person-username">@{{ person.username }}</p>
              </div>
            </div>
            <button class="see-profile-btn pill" @click="openPersonProfile(person)">
              See Profile
            </button>
          </div>
        </div>
      </section>

      <!-- Friends sidebar -->
      <aside class="friendlist-sidebar">
        <h3>Friendlist</h3>
        <div class="search-friends">
          <input v-model="searchQuery" type="text" placeholder="Search friends..." />
        </div>
        <div class="friends-list">
          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="friend-item"
            @click="openPersonProfile(friend)"
          >
            <div class="friend-avatar-small">
              <img v-if="friend.photo" :src="friend.photo" :alt="friend.username" />
              <div v-else class="avatar-placeholder-small">
                {{ friend.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span>{{ friend.username }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Profile Modal -->
    <div
      v-if="showProfileModal && selectedPerson"
      class="profile-modal-overlay"
      @click.self="closeProfileModal"
    >
      <div class="profile-modal">
        <button class="modal-close" @click="closeProfileModal">×</button>
        <div class="profile-modal-header">
          <div class="person-avatar modal-avatar">
            <img
              v-if="selectedPerson.photo"
              :src="selectedPerson.photo"
              :alt="selectedPerson.username"
            />
            <div v-else class="avatar-placeholder">
              {{ selectedPerson.username.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="profile-meta">
            <h3>{{ selectedPerson.username }}</h3>
            <p class="profile-email" v-if="selectedPerson.email">{{ selectedPerson.email }}</p>
          </div>
        </div>
        <p class="profile-about" v-if="selectedPerson.aboutMe">{{ selectedPerson.aboutMe }}</p>
        <div
          v-if="selectedPerson.interests && selectedPerson.interests.length"
          class="profile-interests"
        >
          <span v-for="interest in selectedPerson.interests" :key="interest" class="chip">{{
            interest
          }}</span>
        </div>
        
        <!-- Trips List -->
        <div v-if="selectedPerson.trips && selectedPerson.trips.length" class="profile-trips">
          <h4 class="trips-title">Trips</h4>
          <div class="trips-list">
            <div v-for="(trip, index) in selectedPerson.trips" :key="index" class="trip-list-item">
              <div class="trip-circle-image">
                <span class="trip-initial">{{ (trip.city || trip.destination).charAt(0).toUpperCase() }}</span>
              </div>
              <div class="trip-list-info">
                <span class="trip-list-destination">{{ trip.city || trip.destination }}</span>
                <span class="trip-list-dates">{{ formatTripDates(trip.startDate, trip.endDate) }}</span>
              </div>
              <span class="trip-list-status" :class="trip.status">{{ trip.status }}</span>
            </div>
          </div>
        </div>
        
        <button
          v-if="selectedPerson && !isPersonFriend"
          class="add-friend-btn"
          @click="addFriend(selectedPerson)"
        >
          Add Friend
        </button>
        <button
          v-if="selectedPerson && isPersonFriend"
          class="remove-friend-btn"
          @click="removeFriend(selectedPerson)"
        >
          Remove Friend
        </button>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="logout-modal">
        <div
          v-if="showLogoutModal"
          class="logout-modal-overlay"
          @click.self="showLogoutModal = false"
        >
          <div class="logout-modal">
            <h3>End Session?</h3>
            <p>Are you sure you want to log out?</p>
            <div class="logout-modal-buttons">
              <button class="btn-no" @click="showLogoutModal = false">No</button>
              <button class="btn-yes" @click="confirmLogout">Yes</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  getFriends,
  getSelections,
  getUserFriends,
  addUserFriend,
  removeUserFriend,
} from '../api/api'
import { fetchCountryWikipediaSummary } from '../api/countries'

const auth = useAuthStore()
const user = auth.user

// Logout modal state
const showLogoutModal = ref(false)

function confirmLogout() {
  auth.logout()
  router.push('/')
}

const friends = ref([])
const recommendations = ref([])
const sharedTrips = ref([])
const searchQuery = ref('')
const showProfileModal = ref(false)
const selectedPerson = ref(null)
const shuffledRecommendations = ref([])

const router = useRouter()

const recommendationsToShow = computed(() => {
  return shuffledRecommendations.value.slice(0, 5)
})

// Shuffle and show different recommendations
function refreshRecommendations() {
  const shuffled = [...recommendations.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  shuffledRecommendations.value = shuffled
}

const isPersonFriend = computed(() => {
  if (!selectedPerson.value) return false
  return friends.value.some((f) => f.id === selectedPerson.value.id)
})

// Load friends and recommendations
async function loadFriendsData() {
  if (!user || !user.email) return

  // Get user's actual friends (from userFriends table)
  const userFriendsList = await getUserFriends(user.email)
  const userFriendIds = userFriendsList.map((f) => f.id)

  // Get all available people
  const allPeople = await getFriends()

  // Fetch last trip for each friend
  const friendsWithTrips = await Promise.all(
    userFriendsList.map(async (friend) => {
      console.log('Loading trips for friend:', friend.username)

      // Use trips from the friend object directly (from db.json)
      const friendTrips = friend.trips || []
      console.log('Friend trips:', friendTrips)

      // Get the most recent trip (by startDate)
      const sortedTrips = [...friendTrips].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate),
      )

      let lastTrip = sortedTrips[0] || null
      console.log('Last trip for', friend.username, ':', lastTrip)

      // Fetch image from Wikipedia API if trip exists but no imageUrl
      if (lastTrip) {
        if (!lastTrip.imageUrl) {
          const searchTerm = lastTrip.city || lastTrip.destination
          console.log('Fetching Wikipedia image for:', searchTerm)
          try {
            const wikiData = await fetchCountryWikipediaSummary(searchTerm)
            console.log('Wikipedia data:', wikiData)
            if (wikiData && wikiData.thumbnail && wikiData.thumbnail.source) {
              lastTrip = { ...lastTrip, imageUrl: wikiData.thumbnail.source }
              console.log('Using thumbnail:', wikiData.thumbnail.source)
            } else if (wikiData && wikiData.originalimage && wikiData.originalimage.source) {
              lastTrip = { ...lastTrip, imageUrl: wikiData.originalimage.source }
              console.log('Using original image:', wikiData.originalimage.source)
            }
          } catch (e) {
            console.error('Error fetching Wikipedia image:', e)
          }
        } else {
          console.log('Using existing imageUrl:', lastTrip.imageUrl)
        }
      }

      return {
        ...friend,
        lastTrip,
      }
    }),
  )

  console.log('Friends with trips:', friendsWithTrips)
  friends.value = friendsWithTrips

  // Recommendations are people not yet added as friends
  recommendations.value = allPeople.filter((p) => !userFriendIds.includes(p.id))

  // Initialize shuffled recommendations
  refreshRecommendations()

  // Get user's trips to find shared destinations
  const userTrips = await getSelections(user.email)
  sharedTrips.value = userTrips.slice(0, 3) // Show first 3 shared trips
}

function formatLastTripDate(friend) {
  // Format the last trip date for display
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

  if (friend.lastTrip && friend.lastTrip.startDate) {
    const tripDate = new Date(friend.lastTrip.startDate)
    const month = months[tripDate.getMonth()]
    const year = tripDate.getFullYear()
    return `${month} ${year}`
  }

  // Fallback to current date if no trip
  const now = new Date()
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  return `${month} ${year}`
}

function formatTripDates(startDate, endDate) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  if (!startDate) return ''
  
  const start = new Date(startDate)
  const startMonth = months[start.getMonth()]
  const startYear = start.getFullYear()
  
  if (!endDate) return `${startMonth} ${startYear}`
  
  const end = new Date(endDate)
  const endMonth = months[end.getMonth()]
  const endYear = end.getFullYear()
  
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`
  }
  
  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`
  }
  
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}

const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value
  return friends.value.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function openPersonProfile(person) {
  selectedPerson.value = person
  showProfileModal.value = true
}

function closeProfileModal() {
  showProfileModal.value = false
  selectedPerson.value = null
}

function goToJournal(tripId) {
  if (tripId) router.push({ name: 'Journal', params: { tripId } })
}

async function addFriend(person) {
  if (!person) return
  if (!user || !user.email) return
  if (friends.value.some((f) => f.id === person.id)) return

  // Guardar no servidor
  const result = await addUserFriend(user.email, person.id)
  if (result) {
    recommendations.value = recommendations.value.filter((p) => p.id !== person.id)
    friends.value = [...friends.value, person]
  }

  closeProfileModal()
}

async function removeFriend(person) {
  if (!person) return
  if (!user || !user.email) return
  if (!friends.value.some((f) => f.id === person.id)) return

  // Remover do servidor
  const result = await removeUserFriend(user.email, person.id)
  if (result) {
    friends.value = friends.value.filter((f) => f.id !== person.id)
    recommendations.value = [...recommendations.value, person]
  }

  closeProfileModal()
}

onMounted(() => {
  loadFriendsData()
})
</script>

<style src="../css/NavBar.css"></style>
<style src="../css/FriendsPage.css"></style>
