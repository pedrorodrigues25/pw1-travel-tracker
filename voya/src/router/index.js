import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import InterestsView from '../views/InterestsView.vue'
import DestinationsView from '../views/DestinationsView.vue'
import ProfileView from '../views/ProfileView.vue'
import RecomendationsView from '../views/RecomendationsView.vue'
import FriendsView from '../views/FriendsView.vue'

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
      path: '/destinations',
      component: DestinationsView,
      name: 'Destinations',
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
  ],
})

export default router
