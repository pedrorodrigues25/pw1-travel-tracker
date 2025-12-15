<template>
  <div class="landing">
    <header class="header">
      <div class="brand">
        <img src="@/img/logo_deitada.png" alt="Voya" class="logo" />
      </div>
      <nav class="auth-nav">
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
        <h1 class="title">
          <span class="title-light">REGISTER</span>
          <span class="title-strong"> ALL YOUR TRIPS</span>
        </h1>
        <h2 class="subtitle">AND SHARE IT WITH <span class="subtitle-strong">FRIENDS</span></h2>
        <div class="ctas">
          <router-link class="btn btn-accent" to="/register">GET STARTED</router-link>
        </div>
      </section>
    </main>

    <section class="about-section">
      <svg 
        class="wave-top"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1512 214" 
        preserveAspectRatio="none"
      >
        <path 
          d="M498.364 87.8581C687.885 87.8581 750.771 23.5598 889.897 23.5598C1029.02 23.5598 1037.64 149.702 1281.43 121.234C1525.22 92.7663 1595 214 1595 214H-59C-59 214 59.0198 4.15429e-06 196.422 0C333.825 -4.15429e-06 308.843 87.858 498.364 87.8581Z" 
          fill="#ED9875"
        />
      </svg>

      <svg 
        class="wave-bottom"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1512 206" 
        preserveAspectRatio="none"
      >
        <path 
          d="M1967.89 0.51796C1632 156.425 989.625 -14.7618 597.127 156.425C204.628 327.611 -110.995 0.51796 -110.995 0.51796V0H1967.89C1967.89 0 1968.11 0.417337 1967.89 0.51796Z" 
          fill="#ED9875"
        />
      </svg>

      <div class="about-overlay">ABOUT</div>
    </section>
  </div>
</template>

<script setup>
// View renders landing layout directly.
</script>

<style src="../css/LandingPage.css"></style>
