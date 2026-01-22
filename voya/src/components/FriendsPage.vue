<template>
  <div class="friends-container">
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
              <span class="friend-date">{{ formatLastTripDate(friend) }}</span>
            </div>
            <div class="friend-card-body">
              <img
                v-if="friend.lastTrip && friend.lastTrip.imageUrl"
                :src="friend.lastTrip.imageUrl"
                :alt="friend.lastTrip.city || friend.lastTrip.destination"
                class="friend-trip-image"
              />
              <div v-else class="no-trip-placeholder">
                <span>No trips yet</span>
              </div>
              <div v-if="friend.lastTrip" class="friend-trip-overlay">
                <span class="trip-location">{{
                  friend.lastTrip.city || friend.lastTrip.destination
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Your trips with friends -->
      <section class="shared-trips">
        <h2>Your trips with friends</h2>
        <div class="trips-cards">
          <div v-for="trip in sharedTrips" :key="trip.id" class="trip-card-small">
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
        <h2>People you may know</h2>
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
        <div v-if="recommendations.length > 4" class="recommendations-toggle">
          <button
            class="toggle-rec-btn"
            @click="showMoreRecommendations = !showMoreRecommendations"
          >
            {{ showMoreRecommendations ? 'Show Less' : 'Show More' }}
          </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const friends = ref([])
const recommendations = ref([])
const sharedTrips = ref([])
const searchQuery = ref('')
const showProfileModal = ref(false)
const selectedPerson = ref(null)
const showMoreRecommendations = ref(false)

const recommendationsToShow = computed(() => {
  if (showMoreRecommendations.value) return recommendations.value
  return recommendations.value.slice(0, 4)
})

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
      console.log('Loading trips for friend:', friend.username, friend.email)
      const friendTrips = await getSelections(friend.email)
      console.log('Friend trips:', friendTrips)

      // Get the most recent trip (by createdAt or startDate)
      const sortedTrips = friendTrips.sort(
        (a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate),
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
