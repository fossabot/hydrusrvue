import Vue from 'vue'
import Router from 'vue-router'
import qs from 'qs'

import store from '@/store'
import config from '@/config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import(/* webpackChunkName: "registration" */ '@/views/Registration'),
      meta: {
        noAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (!config.registrationIsEnabled) {
          return next('/login')
        }

        next()
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/logout',
      beforeEnter: async (to, from, next) => {
        if (to.query.everywhere) {
          await store.dispatch('auth/deauthorize', true)

          return
        }

        await store.dispatch('auth/deauthorize', false)
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '@/views/User'),
      meta: {
        auth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings'),
      meta: {
        auth: true
      }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "tags" */ '@/views/Tags'),
      meta: {
        auth: true
      }
    },
    {
      path: '/files',
      name: 'files',
      component: () => import(/* webpackChunkName: "files" */ '@/views/Files'),
      meta: {
        auth: true
      }
    },
    {
      path: '/files/:id',
      name: 'file',
      component: () => import(/* webpackChunkName: "file" */ '@/views/File'),
      meta: {
        auth: true
      },
      beforeEnter: (to, from, next) => {
        if (isNaN(to.params.id)) {
          return next('/files')
        }

        next()
      }
    },
    { path: '*', redirect: '/' }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
  },
  parseQuery: query => {
    return qs.parse(query)
  },
  stringifyQuery: query => {
    const result = qs.stringify(query)

    return result ? `?${result}` : ''
  },
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active'
})
