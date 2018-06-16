import {
  INITIALIZE_APP, OPEN_NAVIGATION, CLOSE_NAVIGATION
} from '@/store/mutation-types'
import config from '@/config'

export default {
  namespaced: true,
  state: {
    isInitialized: false,
    navigationIsOpen: false
  },
  mutations: {
    [INITIALIZE_APP] (state) {
      state.isInitialized = true
    },
    [OPEN_NAVIGATION] (state, payload) {
      state.navigationIsOpen = true
    },
    [CLOSE_NAVIGATION] (state, payload) {
      state.navigationIsOpen = false
    }
  },
  actions: {
    async initialize (context) {
      await context.dispatch('api/fetchStatus', false, { root: true })

      if (!context.rootState.error.isFatal) {
        await context.dispatch('auth/checkAuthorization', false, { root: true })
      }

      context.dispatch(
        'settings/save',
        {
          restrictImageSize: (
            JSON.parse(localStorage.getItem('restrictImageSize'))
          ),
          colors: JSON.parse(localStorage.getItem('colors')) || [],
          filesSorting: JSON.parse(localStorage.getItem('filesSorting')) ||
            'id',
          filesSortingDirection: JSON.parse(
            localStorage.getItem('filesSortingDirection')
          ) || 'default',
          filesSortingNamespaces: JSON.parse(
            localStorage.getItem('filesSortingNamespaces')
          ) || [config.fallbackFilesSortingNamespace],
          tagsSorting: JSON.parse(localStorage.getItem('tagsSorting')) ||
            'id',
          tagsSortingDirection: JSON.parse(
            localStorage.getItem('tagsSortingDirection')
          ) || 'default'
        },
        { root: true }
      )

      context.commit(INITIALIZE_APP)
    },
    openNavigation ({ commit }) {
      commit(OPEN_NAVIGATION)
    },
    closeNavigation ({ commit }) {
      commit(CLOSE_NAVIGATION)
    }
  }
}
