<template>
  <div class="admin-dashboard">
    <!-- Admin Header with Logo and Logout -->
    <header class="admin-header">
      <div class="admin-header-left">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="40" class="admin-logo" />
      </div>
      <div class="admin-header-right">
        <span class="admin-badge">👤 Admin</span>
        <button class="logout-btn" @click="logout">Log Out</button>
      </div>
    </header>

    <!-- Admin Dashboard Main Content -->
    <div class="admin-main">
      <section class="dashboard-title">
        <h1>Admin Dashboard</h1>
        <p>Manage users and platform moderation</p>
      </section>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users-icon">👥</div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <p class="stat-number">{{ totalUsers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon banned-icon">🚫</div>
          <div class="stat-content">
            <h3>Banned Users</h3>
            <p class="stat-number">{{ bannedUsers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active-icon">✅</div>
          <div class="stat-content">
            <h3>Active Users</h3>
            <p class="stat-number">{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="admin-controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by username or email..."
          class="search-input"
        />
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <!-- Users Table -->
      <section class="users-section">
        <h2>Users Management</h2>
        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Ban Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" :class="getRowClass(user)">
                <td class="user-cell">
                  <div class="user-info">
                    <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                    <span>{{ user.username }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(user)]">
                    {{ getStatusText(user) }}
                  </span>
                </td>
                <td>
                  <span v-if="user.bannedUntil" class="ban-time">
                    {{ formatBanExpiry(user.bannedUntil) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="actions">
                  <button
                    v-if="!isBanned(user)"
                    class="btn btn-ban"
                    @click="openBanModal(user)"
                  >
                    Ban
                  </button>
                  <button
                    v-if="isBanned(user)"
                    class="btn btn-unban"
                    @click="unbanUser(user)"
                  >
                    Unban
                  </button>
                  <button class="btn btn-delete" @click="openDeleteModal(user)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Interests Management Section -->
      <section class="users-section" style="margin-top: 30px;">
        <h2>Interests Management</h2>
        <p style="color: #666; margin-bottom: 20px;">Add or remove interests that appear for users</p>
        
        <div class="admin-controls" style="margin-bottom: 20px;">
          <input
            v-model="newInterestName"
            type="text"
            placeholder="Enter new interest name..."
            class="search-input"
            @keyup.enter="handleAddInterest"
          />
          <button class="btn btn-unban" @click="handleAddInterest">Add Interest</button>
        </div>

        <div class="interests-grid">
          <div v-for="interest in availableInterests" :key="interest.id" class="interest-item">
            <span class="interest-name">{{ interest.name }}</span>
            <button class="btn btn-delete btn-small" @click="handleDeleteInterest(interest.id)">✕</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Ban Modal -->
    <div v-if="showBanModal && selectedUser" class="modal-overlay" @click.self="closeBanModal">
      <div class="modal">
        <button class="modal-close" @click="closeBanModal">×</button>
        <h3>Ban User: {{ selectedUser.username }}</h3>
        <p>Select ban duration:</p>

        <div class="ban-options">
          <button
            v-for="duration in banDurations"
            :key="duration.hours"
            class="ban-option-btn"
            :class="{ active: selectedBanDuration === duration.hours }"
            @click="selectedBanDuration = duration.hours"
          >
            <span>{{ duration.label }}</span>
            <span class="duration-hours">({{ duration.hours }}h)</span>
          </button>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeBanModal">Cancel</button>
          <button class="btn-confirm btn-ban" @click="confirmBan">Ban User</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal && selectedUser" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal modal-danger">
        <button class="modal-close" @click="closeDeleteModal">×</button>
        <h3>Delete User: {{ selectedUser.username }}</h3>
        <p class="warning">⚠️ This action is permanent and cannot be undone.</p>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDeleteModal">Cancel</button>
          <button class="btn-confirm btn-delete" @click="confirmDelete">Delete Permanently</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getUsers, updateUser, getAvailableInterests, addAvailableInterest, deleteAvailableInterest } from '../api/api'

const router = useRouter()
const auth = useAuthStore()

const users = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const showBanModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)
const selectedBanDuration = ref(3)

// Interests management
const availableInterests = ref([])
const newInterestName = ref('')

const banDurations = [
  { hours: 1, label: '1 Hour' },
  { hours: 3, label: '3 Hours' },
  { hours: 6, label: '6 Hours' },
  { hours: 24, label: '24 Hours' },
  { hours: 72, label: '3 Days' },
  { hours: 168, label: '1 Week' },
]

// Load users
async function loadUsers() {
  const allUsers = await getUsers()
  users.value = allUsers || []
}

// Load available interests
async function loadInterests() {
  const interests = await getAvailableInterests()
  availableInterests.value = interests || []
}

async function handleAddInterest() {
  if (!newInterestName.value.trim()) return
  const result = await addAvailableInterest(newInterestName.value.trim())
  if (result) {
    availableInterests.value.push(result)
    newInterestName.value = ''
  }
}

async function handleDeleteInterest(id) {
  const success = await deleteAvailableInterest(id)
  if (success) {
    availableInterests.value = availableInterests.value.filter((i) => i.id !== id)
  }
}

const totalUsers = computed(() => users.value.length)
const bannedUsers = computed(() => users.value.filter((u) => isBanned(u)).length)
const activeUsers = computed(() => users.value.filter((u) => !isBanned(u)).length)

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (u) => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value === 'active') {
    filtered = filtered.filter((u) => !isBanned(u))
  } else if (filterStatus.value === 'banned') {
    filtered = filtered.filter((u) => isBanned(u))
  }

  return filtered
})

function isBanned(user) {
  return user.bannedUntil && new Date(user.bannedUntil) > new Date()
}

function getStatusText(user) {
  return isBanned(user) ? 'Banned' : 'Active'
}

function getStatusClass(user) {
  return isBanned(user) ? 'banned' : 'active'
}

function getRowClass(user) {
  return isBanned(user) ? 'row-banned' : ''
}

function formatBanExpiry(bannedUntil) {
  const now = new Date()
  const expiryDate = new Date(bannedUntil)
  const diffMs = expiryDate - now
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 0) {
    return 'Expired'
  } else if (diffHours < 1) {
    return 'Less than 1h'
  } else if (diffHours < 24) {
    return `${diffHours}h remaining`
  } else {
    return `${diffDays}d ${diffHours % 24}h remaining`
  }
}

function openBanModal(user) {
  selectedUser.value = user
  selectedBanDuration.value = 3
  showBanModal.value = true
}

function closeBanModal() {
  showBanModal.value = false
  selectedUser.value = null
}

async function confirmBan() {
  if (!selectedUser.value) return

  const now = new Date()
  const banExpiryTime = new Date(now.getTime() + selectedBanDuration.value * 60 * 60 * 1000)
  
  console.log('Banning user:', selectedUser.value.username)
  console.log('Ban expiry time:', banExpiryTime.toISOString())
  console.log('Current time:', now.toISOString())
  console.log('Duration in hours:', selectedBanDuration.value)

  const result = await updateUser(selectedUser.value.id, {
    bannedUntil: banExpiryTime.toISOString(),
  })

  console.log('Ban result:', result)

  if (result) {
    const idx = users.value.findIndex((u) => u.id === selectedUser.value.id)
    if (idx !== -1) {
      users.value[idx] = result
    }
    closeBanModal()
  }
}

async function unbanUser(user) {
  const result = await updateUser(user.id, {
    bannedUntil: null,
  })

  if (result) {
    const idx = users.value.findIndex((u) => u.id === user.id)
    if (idx !== -1) {
      users.value[idx] = result
    }
  }
}

function openDeleteModal(user) {
  selectedUser.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedUser.value = null
}

async function confirmDelete() {
  if (!selectedUser.value) return

  // Delete via API (precisa de implementar no backend)
  try {
    await fetch(`http://localhost:3001/users/${selectedUser.value.id}`, {
      method: 'DELETE',
    })
    users.value = users.value.filter((u) => u.id !== selectedUser.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

async function logout() {
  auth.logout()
  router.push('/login')
}

onMounted(() => {
  // Check if user is admin
  const user = auth.user
  if (!user || user.email !== 'admin@gmail.com') {
    router.push('/login')
    return
  }
  loadUsers()
  loadInterests()
})
</script>

<style src="../css/AdminPage.css"></style>
