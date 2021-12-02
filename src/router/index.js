import { createRouter, createWebHistory } from 'vue-router'
//import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue')
  },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('../views/PasswordReset.vue')
  },
  {
    path: '/design-system',
    name: 'DesignSystem',
    component: () => import('../views/DesignSystem.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
