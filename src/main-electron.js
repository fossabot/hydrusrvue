import '@babel/polyfill'
import 'electron-cookies'

import Vue from 'vue'
import VueHeadful from 'vue-headful'
import VueHotkey from 'v-hotkey'
import PhotoSwipe from 'vue-simple-photoswipe/dist/vue-simple-photoswipe'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCog,
  faImages,
  faInfo,
  faLongArrowAltLeft,
  faSave,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
  faSort,
  faSpinner,
  faTrash,
  faUser,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'

import router from '@/router'
import store from '@/store'

import App from '@/App'

import '@/styles/main'

Vue.component('vue-headful', VueHeadful)
Vue.use(VueHotkey)
Vue.use(PhotoSwipe)

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

router.beforeEach((to, from, next) => {
  store.dispatch('app/closeNavigation')

  store.dispatch('error/flush')

  if (to.path !== '/logout') {
    store.dispatch('auth/checkCookie')
  }

  const authIsRequired = to.matched.some(route => route.meta.auth)
  const noAuthIsRequired = to.matched.some(route => route.meta.noAuth)
  const isAuthorized = store.state.auth.isAuthorized

  if (authIsRequired && !isAuthorized) {
    return next('/login')
  }

  if (noAuthIsRequired && isAuthorized) {
    return next('/')
  }

  next()
})

library.add(
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCog,
  faImages,
  faInfo,
  faLongArrowAltLeft,
  faSave,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
  faSort,
  faSpinner,
  faTrash,
  faUser,
  faUserPlus
)

new Vue({
  router,
  store,
  mounted: function () {
    this.$store.dispatch('app/initialize')
  },
  render: h => h(App)
}).$mount('#app')
