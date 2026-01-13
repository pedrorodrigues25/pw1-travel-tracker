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
            <span class="title-light">TRACK EVERY</span><br>
            <span class="title-bold">MILE</span>
          </h1>
          <p class="hero-subtitle">DISCOVER EVERY WONDER</p>
        </div>
      </div>
    </section>

    <!-- Connection Section -->
    <section class="connection-section">
      <div class="connection-content">
        <!-- Profile circles scattered around -->
        <div class="profile-circle circle-1"></div>
        <div class="profile-circle circle-2"></div>
        <div class="profile-circle circle-3"></div>
        <div class="profile-circle circle-4"></div>
        <div class="profile-circle circle-5"></div>
        <div class="profile-circle circle-6"></div>
        
        <div class="connection-text-container">
          <h2 class="connection-title">NEVER MISS A CONNECTION</h2>
          <p class="connection-text">Share your bucket list and see where your friends are headed next.</p>
        </div>
      </div>
    </section>

    <!-- Travel Built Around You Section -->
    <section class="travel-section">
      <h2 class="travel-title">TRAVEL BUILT AROUND YOU</h2>
      <div class="travel-content">
        <div class="travel-left">
          <p class="travel-text">
            Stop scrolling aimlessly. Whether you're a mountain hiker, a city foodie, or a hidden-beach seeker, Voya suggests your next dream trip based on your unique interests and past adventures.
          </p>
        </div>
        <div class="travel-right">
          <div class="travel-tags">
            <span class="tag tag-filled">✓ PERFECT FOR</span>
            <span class="tag tag-outline">✗ INSPIRE ME TO EXPLORE</span>
            <span class="tag tag-outline">◇ CULTURE & MUSEUMS</span>
            <span class="tag tag-outline">☆ CITY WALKTHROUGH</span>
            <span class="tag tag-filled">◐ PEACEFUL TRIPS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Know Before You Go Section -->
    <section class="know-section">
      <div class="know-content">
        <div class="know-left">
          <div class="know-image-container">
            <img src="@/img/caminho.png" alt="Destination" class="know-image" />
            <div class="know-image-label">Sei, Kyoto</div>
          </div>
        </div>
        <div class="know-right">
          <h2 class="know-title">KNOW BEFORE YOU GO</h2>
          <p class="know-text">
            Get curated insights on every destination. From local etiquette tips to essential travel requirements, we provide the data so you can focus on the experience.
          </p>
        </div>
      </div>
    </section>

    <!-- Collect Memories Section -->
    <section class="collect-section">
      <h2 class="collect-title">COLLECT MEMORIES. EARN YOUR STATUS</h2>
      <p class="collect-subtitle">Every trip counts. Level up your profile, unlock exclusive badges.</p>
      <div class="badges-container">
        <div class="badge-item" v-for="i in 7" :key="i">
          <div class="badge-circle-landing">
            <span class="badge-text">BADGE {{ i }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <img src="@/img/logo_deitada.png" alt="Voya" class="footer-logo" />
        <div class="footer-links">
          <span>POLICY</span>
          <span>RECOMMENDATIONS</span>
          <span>SUPPORT</span>
        </div>
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
</script>

<style src="../css/LandingPage.css"></style>
