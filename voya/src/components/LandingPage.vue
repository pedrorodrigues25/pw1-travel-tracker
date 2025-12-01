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
          <!-- Caminho (bottom-left) -->
          <img class="blob blob-1" src="@/img/caminho.png" alt="Caminho" />
          <!-- Barco (top middle) -->
          <img class="blob blob-2" src="@/img/barco.png" alt="Barco" />
          <!-- Escrita/mapa (bottom-right) -->
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
  
  <!-- Wave 1 (top) -->
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

  <!-- Wave 2 (bottom) -->
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
// No script logic needed for static landing
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: #8EA5B5; /* requested blue */
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  overflow-x: hidden; 
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.logo {
  height: 30px;
}

.auth-nav {
  display: flex;
  gap: 14px;
  align-items: center;
}

.link {
  color: #ffffff;
  opacity: 0.9;
  text-decoration: none;
  font-weight: 600;
}
.small-caps { letter-spacing: 0.8px; font-size: 12px; }

.btn {
  border: none;
  padding: 10px 18px;
  border-radius: 22px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background: #0c3959;
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(12,57,89,0.35);
}

.hero {
  width: 100%;
  max-width: 1200px; /* constrain to viewport to avoid overflow */
  margin: 0 auto;
  padding: 80px 24px 24px; /* extra top padding to account for absolute header */
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 24px;
}

.blob-gallery {
  position: relative;
  width: 520px;
  height: 520px;
}

.blob {
  position: absolute;
  width: 300px;
  height: 300px;
  object-fit: cover;
  background: transparent;
  box-shadow: none;
  /* shape orgânica semelhante ao mockup */
  clip-path: path("M95,8 Q160,0 220,40 T280,140 Q300,200 260,260 T160,300 Q90,310 40,250 T0,140 Q10,70 60,30 Z");
}

/* Caminho (bottom-left) */
.blob-1 { top: 150px; left: 20px; }

/* Barco (top middle) */
.blob-2 { top: 30px; left: 110px; z-index: 3; }

/* Escrita/mapa (bottom-right) */
.blob-3 { top: 150px; left: 210px; }

/* remove legacy overrides */

.right {
  color: #0c3959;
  padding-left: 12px;
  justify-self: end; /* push right column to the far right */
  text-align: left;
}

.title {
  font-size: 46px;
  line-height: 1.06;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #0c3959;
  margin: 0 0 10px 0;
  text-align: left;
}
.title-light { font-weight: 500; }
.title-strong { font-weight: 800; }

.subtitle {
  font-size: 22px;
  font-weight: 400;
  text-transform: uppercase;
  color: #153e5c;
  margin: 0 0 26px 0;
}
.subtitle-strong { font-weight: 800; }

.btn-accent {
  background: #ff8e5a; /* orange accent */
  color: #0c3959;
  box-shadow: 0 8px 20px rgba(255,142,90,0.55);
}

.about-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}

/* Ambas ocupam 100% da largura e encaixam */
.wave-top,
.wave-bottom {
  width: 100%;
  height: 200px;
  display: block;
  margin: 0;
  padding: 0;
  line-height: 0;
}

/* A de cima encosta na de baixo */
.wave-bottom {
  margin-top: -4px; /* este valor faz as curvas encaixarem 100% */
}

/* Texto ABOUT */
.about-overlay {
  position: absolute;
  left: 40px;
  top: 55%;
  transform: translateY(-50%);
  color: #ffffff;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 1px;
  text-shadow: 0 3px 8px rgba(0,0,0,0.25);
  pointer-events: none;
}


@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
  .blob-gallery { aspect-ratio: 4 / 3; }
  .right { text-align: center; }
}
</style>
