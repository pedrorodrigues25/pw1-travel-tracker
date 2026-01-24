<template>
  <div class="landing">
    <!-- Hero Section -->
    <section class="hero-section">
      <header class="header">
        <div class="brand">
          <img src="@/img/logo_deitada.png" alt="Voya" class="logo" />
        </div>
        <nav class="auth-nav">
          <a class="link small-caps visitor-link" @click="enterAsGuest">GUEST</a>
          <router-link class="btn btn-secondary" to="/register">SIGN UP</router-link>
          <router-link class="btn btn-primary" to="/login">LOG IN</router-link>
        </nav>
      </header>

      <div class="hero-content">
        <div class="hero-left">
          <div class="blob-gallery">
            <img class="blob blob-1" src="@/img/caminho.png" alt="Caminho" />
            <img class="blob blob-2" src="@/img/barco.png" alt="Barco" />
            <img class="blob blob-3" src="@/img/escrita.png" alt="Escrita" />
          </div>
        </div>
        <div class="hero-right">
          <h1 class="hero-title">
            <span class="title-bold">TRACK EVERY MILE</span>
          </h1>
          <p class="title-light">DISCOVER EVERY <i>WONDER</i></p>
        </div>
      </div>
    </section>

    <!-- Connection Section -->
    <section class="connection-section">
      <div class="connection-content">
        <!-- Profile circles scattered around -->
        <div class="profile-circle circle-1">
          <img :src="avatars[0]" alt="User avatar" />
        </div>
        <div class="profile-circle circle-2">
          <img :src="avatars[1]" alt="User avatar" />
        </div>
        <div class="profile-circle circle-3">
          <img :src="avatars[2]" alt="User avatar" />
        </div>
        <div class="profile-circle circle-4">
          <img :src="avatars[3]" alt="User avatar" />
        </div>
        <div class="profile-circle circle-5">
          <img :src="avatars[4]" alt="User avatar" />
        </div>
        <div class="profile-circle circle-6">
          <img :src="avatars[5]" alt="User avatar" />
        </div>

        <div class="connection-text-container">
          <h2 class="connection-title">NEVER MISS A CONNECTION</h2>
          <p class="connection-text">
            Share your bucket list and see where your friends are headed next.
          </p>
        </div>
      </div>
    </section>

    <!-- Travel Built Around You Section -->
    <section class="travel-section">
      <h2 class="travel-title">TRAVEL BUILT AROUND YOU</h2>
      <div class="travel-content">
        <div class="travel-left">
          <p class="travel-text">
            Stop scrolling aimlessly. Whether you're a mountain hiker, a city foodie, or a
            hidden-beach seeker, Voya suggests your next dream trip based on your unique interests
            and past adventures.
          </p>
        </div>
        <div class="travel-right">
          <div class="travel-tags">
            <span class="tag tag-filled"><span class="tag-icon">✕</span> ROAD TRIPS</span>
            <span class="tag tag-filled"><span class="tag-icon">✕</span> BEACH AND RELAXATION</span>
            <span class="tag tag-outline"
              ><span class="tag-icon">+</span> CULTURAL EXPERIENCES</span
            >
            <span class="tag tag-outline"><span class="tag-icon">+</span> CITY EXPLORATION</span>
            <span class="tag tag-outline"><span class="tag-icon">+</span> FAMILY TRIPS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Know Before You Go Section -->
    <section class="know-section">
      <h2 class="know-title">KNOW BEFORE YOU GO</h2>
      <div class="know-content">
        <div class="know-left">
          <div class="know-card">
            <img src="@/img/journal.png" alt="Porto, Portugal" class="know-card-image" />
          </div>
        </div>
        <div class="know-right">
          <p class="know-text">
            Get curated insights on every destination. From local hidden gems to essential travel
            requirements, we provide the data so you can focus on the experience.
          </p>
        </div>
      </div>
    </section>

    <!-- Collect Memories Section -->
    <section class="collect-section">
      <h2 class="collect-title">COLLECT MEMORIES. EARN YOUR STATUS</h2>
      <p class="collect-subtitle">
        Every trip counts. Level up your profile, unlock exclusive badges.
      </p>
      <div class="badges-container">
        <div class="badges-row">
          <div class="badge-item" v-for="(badge, index) in topBadges" :key="index">
            <div class="badge-circle-landing">
              <img :src="badge" alt="badge" />
            </div>
          </div>
        </div>
        <div class="badges-row">
          <div class="badge-item" v-for="(badge, index) in bottomBadges" :key="index">
            <div class="badge-circle-landing">
              <img :src="badge" alt="badge" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <img src="@/img/logo_deitada.png" alt="Voya" class="footer-logo" />
        <!--
        <div class="footer-links">
          <span>POLICY</span>
          <span>RECOMMENDATIONS</span>
          <span>SUPPORT</span>
        </div>-->
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function enterAsGuest() {
  auth.enterAsGuest()
  router.push('/destinations')
}

// Avatars and Badges
const avatars = [
  'https://api.dicebear.com/9.x/identicon/png?seed=traveler1&scale=70&backgroundColor=ffffff',
  'https://api.dicebear.com/9.x/identicon/png?seed=explorer2&scale=70&backgroundColor=ffffff',
  'https://api.dicebear.com/9.x/identicon/png?seed=wanderer3&scale=70&backgroundColor=ffffff',
  'https://api.dicebear.com/9.x/identicon/png?seed=voyager4&scale=70&backgroundColor=ffffff',
  'https://api.dicebear.com/9.x/identicon/png?seed=adventurer5&scale=70&backgroundColor=ffffff',
  'https://api.dicebear.com/9.x/identicon/png?seed=nomad6&scale=70&backgroundColor=ffffff',
]

const badges = [
  new URL('../img/badges/Badge-Friend1.png', import.meta.url).href,
  new URL('../img/badges/Badge-Friend2.png', import.meta.url).href,
  new URL('../img/badges/Badge-Friend3.png', import.meta.url).href,
  new URL('../img/badges/badge-user-1 1.png', import.meta.url).href,
  new URL('../img/badges/badge-user-2 1.png', import.meta.url).href,
]

const topBadges = badges.slice(0, 3)
const bottomBadges = badges.slice(3, 5)
</script>

<style src="../css/LandingPage.css"></style>
