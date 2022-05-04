import { createRouter, createWebHistory } from 'vue-router';
import Discover from '../views/Discover.vue';
import store from "../main.js";

const routes = [
  {
    path: '/',
    name: 'Discover',
    component: Discover,
    meta: {
      title: 'Discover',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Log In',
    }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue'),
    meta: {
      title: 'Registration',
    }
  },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('../views/PasswordReset.vue'),
    meta: {
      title: 'Reset Password',
    }
  },
  {
    path: '/create-new-password',
    name: 'CreateNewPassword',
    component: () => import('../views/CreateNewPassword.vue'),
    meta: {
      title: 'Create New Password',
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    props: true,
    component: () => import('../views/Messages.vue'),
    meta: {
      title: 'Messages',
      //requiresAuth: true
    }
  },
  {
    path: '/account-settings',
    name: 'AccountSettings',
    component: () => import('../views/AccountSettings.vue'),
    meta: {
      title: 'Account Settings',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: 'Profile',
    }
  },
  {
    path: '/profile/:profileURL',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: 'Profile',
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: {
      title: 'Page Not Found',
    }
  },
  {
    path: '/:notFound(.*)',
    redirect: '/404',
  },
  // {
  //   path: '/design-system',
  //   name: 'DesignSystem',
  //   component: () => import('../views/DesignSystem.vue')
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // scrollBehavior(_, _2, savedPosition){
  //   //console.log(to, from, savedPosition)
  //   if(savedPosition){
  //     return savedPosition
  //   }
  //   return {left: 0, top:0}
  // }
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' | Lokoda';
  }
});

router.beforeEach((to, __, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.loggedIn) {
      next({ name: 'Login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
