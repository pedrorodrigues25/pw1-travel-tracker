import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/LoginForm.vue'
import Register from '../components/RegisterForm.vue'
import Destinations from '../components/DestinationsList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Login,
      name: 'Login'
    },
    {
      path: '/register',
      component: Register,
      name: 'Register'
    },
    {
      path: '/destinations',
      component: Destinations,
      name: 'Destinations'
    }
  ],
})

export default router
