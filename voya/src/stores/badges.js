import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Badge definitions for friend trips
const FRIEND_BADGES = [
  {
    id: 'friend-1',
    name: 'First Adventure Together',
    description: 'Complete your first trip with friends',
    image: 'Badge-Friend1.png',
    requirement: 1,
  },
  {
    id: 'friend-2',
    name: 'Travel Crew',
    description: 'Complete 5 trips with friends',
    image: 'Badge-Friend2.png',
    requirement: 5,
  },
  {
    id: 'friend-3',
    name: 'Ultimate Travel Squad',
    description: 'Complete 10 trips with friends',
    image: 'Badge-Friend3.png',
    requirement: 10,
  },
]

// Badge definitions for solo trips
const SOLO_BADGES = [
  {
    id: 'solo-1',
    name: 'Solo Explorer',
    description: 'Complete your first solo trip',
    image: 'badge-user-1 1.png',
    requirement: 1,
  },
  {
    id: 'solo-2',
    name: 'Lone Wanderer',
    description: 'Complete 10 solo trips',
    image: 'badge-user-2 1.png',
    requirement: 10,
  },
]

// All badges combined
const ALL_BADGES = [...FRIEND_BADGES, ...SOLO_BADGES]

export const useBadgesStore = defineStore('badges', () => {
  // State
  const earnedBadges = ref([])
  const newBadge = ref(null) // For showing notification
  const showNotification = ref(true)

  // Get badge image URL
  function getBadgeImageUrl(imageName) {
    return new URL(`../img/badges/${imageName}`, import.meta.url).href
  }

  // Calculate friend trips count from selections
  function countFriendTrips(trips) {
    return trips.filter(
      (trip) =>
        trip.status === 'completed' && !trip.archived && trip.friends && trip.friends.length > 0,
    ).length
  }

  // Calculate solo trips count from selections (no friends or empty friends array)
  function countSoloTrips(trips) {
    return trips.filter(
      (trip) =>
        trip.status === 'completed' &&
        !trip.archived &&
        (!trip.friends || trip.friends.length === 0),
    ).length
  }
  
  // Check and update badges based on trips
  function checkBadges(trips, userEmail) {
    const friendTripsCount = countFriendTrips(trips)
    const soloTripsCount = countSoloTrips(trips)
    const previousEarned = [...earnedBadges.value]

    // Get the last completed friend trip and solo trip for badge association
    const completedFriendTrips = trips
      .filter(
        (trip) =>
          trip.status === 'completed' && !trip.archived && trip.friends && trip.friends.length > 0,
      )
      .sort(
        (a, b) =>
          new Date(b.endDate || b.startDate || b.createdAt) -
          new Date(a.endDate || a.startDate || a.createdAt),
      )

    const completedSoloTrips = trips
      .filter(
        (trip) =>
          trip.status === 'completed' &&
          !trip.archived &&
          (!trip.friends || trip.friends.length === 0),
      )
      .sort(
        (a, b) =>
          new Date(b.endDate || b.startDate || b.createdAt) -
          new Date(a.endDate || a.startDate || a.createdAt),
      )

    const lastFriendTrip = completedFriendTrips[0] || null
    const lastSoloTrip = completedSoloTrips[0] || null

    // Check each friend badge
    FRIEND_BADGES.forEach((badge) => {
      const alreadyEarned = earnedBadges.value.some((b) => b.id === badge.id)
      if (!alreadyEarned && friendTripsCount >= badge.requirement) {
        // Badge earned!
        const earnedBadge = {
          ...badge,
          earnedAt: new Date().toISOString(),
          userEmail,
          associatedTrip: lastFriendTrip
            ? {
                id: lastFriendTrip.id,
                destination: lastFriendTrip.destination,
                city: lastFriendTrip.city || null,
              }
            : null,
        }
        earnedBadges.value.push(earnedBadge)

        // Show notification for newly earned badge
        newBadge.value = earnedBadge
        showNotification.value = true
      }
    })

    // Check each solo badge
    SOLO_BADGES.forEach((badge) => {
      const alreadyEarned = earnedBadges.value.some((b) => b.id === badge.id)
      if (!alreadyEarned && soloTripsCount >= badge.requirement) {
        // Badge earned!
        const earnedBadge = {
          ...badge,
          earnedAt: new Date().toISOString(),
          userEmail,
          associatedTrip: lastSoloTrip
            ? {
                id: lastSoloTrip.id,
                destination: lastSoloTrip.destination,
                city: lastSoloTrip.city || null,
              }
            : null,
        }
        earnedBadges.value.push(earnedBadge)

        // Show notification for newly earned badge
        newBadge.value = earnedBadge
        showNotification.value = true
      }
    })

    // Save to localStorage
    saveBadges(userEmail)
  }

  // Get unlocked badges
  const unlockedBadges = computed(() => {
    return earnedBadges.value.map((badge) => ({
      ...badge,
      imageUrl: getBadgeImageUrl(badge.image),
    }))
  })

  // Get locked badges with progress
  function getLockedBadgesWithProgress(trips) {
    const friendTripsCount = countFriendTrips(trips)
    const soloTripsCount = countSoloTrips(trips)

    // Friend badges progress
    const lockedFriendBadges = FRIEND_BADGES.filter(
      (badge) => !earnedBadges.value.some((b) => b.id === badge.id),
    ).map((badge) => ({
      ...badge,
      imageUrl: getBadgeImageUrl(badge.image),
      progress: Math.min((friendTripsCount / badge.requirement) * 100, 100),
      current: friendTripsCount,
      type: 'friend',
    }))

    // Solo badges progress
    const lockedSoloBadges = SOLO_BADGES.filter(
      (badge) => !earnedBadges.value.some((b) => b.id === badge.id),
    ).map((badge) => ({
      ...badge,
      imageUrl: getBadgeImageUrl(badge.image),
      progress: Math.min((soloTripsCount / badge.requirement) * 100, 100),
      current: soloTripsCount,
      type: 'solo',
    }))

    return [...lockedFriendBadges, ...lockedSoloBadges]
  }

  // Close notification
  function closeNotification() {
    showNotification.value = false
    newBadge.value = null
  }

  // Save badges to localStorage
  function saveBadges(userEmail) {
    if (!userEmail) return
    const key = `voya_badges_${userEmail}`
    localStorage.setItem(key, JSON.stringify(earnedBadges.value))
  }

  // Load badges from localStorage
  function loadBadges(userEmail) {
    if (!userEmail) return
    const key = `voya_badges_${userEmail}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        earnedBadges.value = JSON.parse(stored)
      } catch (e) {
        earnedBadges.value = []
      }
    } else {
      earnedBadges.value = []
    }
  }

  // Reset store
  function reset() {
    earnedBadges.value = []
    newBadge.value = null
    showNotification.value = false
  }

  return {
    // State
    earnedBadges,
    newBadge,
    showNotification,
    // Getters
    unlockedBadges,
    // Actions
    checkBadges,
    getLockedBadgesWithProgress,
    closeNotification,
    loadBadges,
    saveBadges,
    reset,
    getBadgeImageUrl,
    countFriendTrips,
  }
})
