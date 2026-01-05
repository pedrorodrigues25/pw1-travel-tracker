<template>
  <div class="trips">
    <nav class="navbar">
      <router-link to="/" class="navbar-logo">
        <img src="@/img/logo-pw1-voya.png" alt="Voya Logo" height="38" />
      </router-link>
      <div class="navbar-links">
        <router-link to="/destinations" active-class="active">Home</router-link>
        <a href="#" class="navbar-link">Recommendations</a>
        <router-link to="/trips" active-class="active">Trips</router-link>
        <a href="#" class="navbar-link">Friends</a>
        <router-link to="/profile" active-class="active">Profile</router-link>
      </div>
    </nav>
  </div>
</template>
