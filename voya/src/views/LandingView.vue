<template>
  <div class="landing">
    <header class="header">
      <div class="brand">
        <img src="@/img/logo_deitada.png" alt="Voya" class="logo" />
      </div>
      <nav class="auth-nav">
        <a class="link small-caps visitor-link" @click="enterAsGuest">GUEST</a>
        <router-link class="link small-caps" to="/register">SIGN IN</router-link>
        <router-link class="btn btn-primary" to="/login">LOG IN</router-link>
      </nav>
    </header>

    <main class="hero">
      <section class="left">
        <div class="blob-gallery">
          <img class="blob blob-1" src="@/img/caminho.png" alt="Caminho" />
          <img class="blob blob-2" src="@/img/barco.png" alt="Barco" />
          <img class="blob blob-3" src="@/img/escrita.png" alt="Escrita" />
        </div>
      </section>
      <section class="right">
        <h1 class="title">track every <br> mile</h1>
        <h2 class="subtitle">discover every wonder</h2>
      </section>
    </main>

    <section class="about-section">
      <svg class="wave-top" viewBox="0 0 1512 214" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M498.364 87.8581C687.885 87.8581 750.771 23.5598 889.897 23.5598C1029.02 23.5598 1037.64 149.702 1281.43 121.234C1525.22 92.7663 1595 214 1595 214H-59C-59 214 59.0198 4.15429e-06 196.422 0C333.825 -4.15429e-06 308.843 87.858 498.364 87.8581Z" fill="#ED9875"/>
      </svg>
      
      <div class="friends-info">
        <div class="profile-circle p1"><img src="https://i.pravatar.cc/150?u=1" alt="User"></div>
        <div class="profile-circle p2"><img src="https://i.pravatar.cc/150?u=2" alt="User"></div>
        <div class="profile-circle p3"><img src="https://i.pravatar.cc/150?u=3" alt="User"></div>
        <div class="profile-circle p4"><img src="https://i.pravatar.cc/150?u=4" alt="User"></div>
        <div class="profile-circle p5"><img src="https://i.pravatar.cc/150?u=5" alt="User"></div>

        <h2 class="body-subtitle">never miss a connection</h2>
        <p class="body-text">share your bucket list and see where your friends are headed next.</p>
      </div>

      <!-- <svg class="wave-bottom" viewBox="0 0 1512 206" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1967.89 0.51796C1632 156.425 989.625 -14.7618 597.127 156.425C204.628 327.611 -110.995 0.51796 -110.995 0.51796V0H1967.89C1967.89 0 1968.11 0.417337 1967.89 0.51796Z" fill="#ED9875"/>
      </svg> -->
    </section>

    <section class="personalization-section">
      <h2 class="section-title">travel built around you</h2>
      <div class="personalization-container">
        <div class="perso-left">
          <p class="perso-text">
            stop scrolling aimlessly. whether you're a mountain hiker, a city foodie, or a hidden-beach seeker, voya suggests your next dream trip based on your unique interests and past adventures.
          </p>
        </div>
        <div class="perso-right">
          <div class="tags-list">
            <button 
              v-for="(tag, index) in tags" 
              :key="index" 
              :class="['tag-item', { active: tag.active }]"
              @click="tag.active = !tag.active"
            >
              <span class="tag-icon">{{ tag.active ? '✕' : '+' }}</span>
              {{ tag.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="landing">
    <section class="insights-section">
      <div class="insights-container">
        <div class="insights-image">
          <img src="@/img/mockup_porto.png" alt="Porto Destination Mockup" class="mockup-img" />
        </div>
        <div class="insights-text">
          <h2 class="section-title-white">KNOW BEFORE YOU GO</h2>
          <p class="body-text-white">
            GET CURATED INSIGHTS ON EVERY DESTINATION. FROM LOCAL HIDDEN GEMS TO ESSENTIAL TRAVEL REQUIREMENTS, WE PROVIDE THE DATA SO YOU CAN FOCUS ON THE EXPERIENCE.
          </p>
        </div>
      </div>
    </section>

    <section class="badges-section">
      <h2 class="badges-title">COLLECT MEMORIES, EARN YOUR STATUS</h2>
      <p class="badges-subtitle">EVERY TRIP COUNTS. LEVEL UP YOUR PROFILE, UNLOCK EXCLUSIVE BADGES</p>
      
      <div class="badges-grid">
        <div v-for="i in 7" :key="i" class="badge-item">
          <img src="@/img/badge_tribe.png" alt="Tribe on the move" />
        </div>
      </div>
    </section>

    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <img src="@/img/logo_deitada.png" alt="Voya" class="footer-logo" />
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <router-link to="/">HOME</router-link>
            <router-link to="/trips">TRIPS</router-link>
            <router-link to="/profile">PROFILE</router-link>
          </div>
          <div class="footer-column">
            <router-link to="/recommendations">RECOMMENDATIONS</router-link>
            <router-link to="/friends">FRIENDS</router-link>
          </div>
          <div class="footer-column">
            <router-link to="/login">LOG IN</router-link>
            <router-link to="/register">SIGN UP</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tags = ref([
  { label: 'road trips', active: true },
  { label: 'beach and relaxation', active: true },
  { label: 'cultural experiences', active: false },
  { label: 'city exploration', active: false },
  { label: 'family trips', active: false }
])

function enterAsGuest() {
  router.push('/destinations')
}
</script>

<style src="../css/LandingPage.css"></style>