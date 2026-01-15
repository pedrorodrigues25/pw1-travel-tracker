import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import InterestsView from '../views/InterestsView.vue'
import HomePage from '../views/HomePageView.vue'
import ProfileView from '../views/ProfileView.vue'
import RecomendationsView from '../views/RecomendationsView.vue'
import FriendsView from '../views/FriendsView.vue'
import AdminView from '../views/AdminView.vue'

import JournalView from '../views/JournalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LandingView,
      name: 'Landing',
    },
    {
      path: '/homepage',
      component: HomePage,
      name: 'Homepage',
    },
    {
      path: '/login',
      component: LoginView,
      name: 'Login',
    },
    {
      path: '/register',
      component: RegisterView,
      name: 'Register',
    },
    {
      path: '/interests',
      component: InterestsView,
      name: 'Interests',
    },
    {
      path: '/profile',
      component: ProfileView,
      name: 'Profile',
    },
    {
      path: '/recommendations',
      component: RecomendationsView,
      name: 'Recommendations',
    },
    {
      path: '/friends',
      component: FriendsView,
      name: 'Friends',
    },
    {
      path: '/admin',
      component: AdminView,
      name: 'Admin',
    },
    {
      path: '/trips',
      component: () => import('../views/TripsView.vue'),
      name: 'Trips',
    },
    {
      path: '/journal/:tripId',
      component: JournalView,
      name: 'Journal',
      props: true,
    },
    {
      path: '/destination/:destinationId',
      component: () => import('../views/DestinationDetailView.vue'),
      name: 'DestinationDetail',
      props: true,
    },
  ],
})

export default router
