import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import InterestsView from '../views/InterestsView.vue'
import DestinationsView from '../views/DestinationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LandingView,
      name: 'Landing'
    },
    {
      path: '/login',
      component: LoginView,
      name: 'Login'
    },
    {
      path: '/register',
      component: RegisterView,
      name: 'Register'
    },
    {
      path: '/interests',
      component: InterestsView,
      name: 'Interests'
    },
    {
      path: '/destinations',
      component: DestinationsView,
      name: 'Destinations'
    }
  ],
})

export default router
