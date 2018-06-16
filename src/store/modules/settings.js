import {
  SET_RESTRICT_IMAGE_SIZE,
  SET_COLORS,
  SET_FILES_SORTING,
  SET_FILES_SORTING_DIRECTION,
  SET_FILES_SORTING_NAMESPACES,
  SET_TAGS_SORTING,
  SET_TAGS_SORTING_DIRECTION
} from '@/store/mutation-types'
import config from '@/config'

export default {
  namespaced: true,
  state: {
    restrictImageSize: false,
    colors: [],
    filesSorting: 'id',
    filesSortingDirection: 'default',
    filesSortingNamespaces: [],
    tagsSorting: 'id',
    tagsSortingDirection: 'default'
  },
  mutations: {
    [SET_RESTRICT_IMAGE_SIZE] (state, payload) {
      state.restrictImageSize = payload
    },
    [SET_COLORS] (state, payload) {
      state.colors = payload
    },
    [SET_FILES_SORTING] (state, payload) {
      state.filesSorting = payload
    },
    [SET_FILES_SORTING_DIRECTION] (state, payload) {
      state.filesSortingDirection = payload
    },
    [SET_FILES_SORTING_NAMESPACES] (state, payload) {
      state.filesSortingNamespaces = payload
    },
    [SET_TAGS_SORTING] (state, payload) {
      state.tagsSorting = payload
    },
    [SET_TAGS_SORTING_DIRECTION] (state, payload) {
      state.tagsSortingDirection = payload
    }
  },
  actions: {
    save ({ commit }, payload) {
      commit(SET_RESTRICT_IMAGE_SIZE, payload.restrictImageSize)
      localStorage.setItem(
        'restrictImageSize', JSON.stringify(payload.restrictImageSize)
      )

      commit(SET_COLORS, payload.colors)
      localStorage.setItem('colors', JSON.stringify(payload.colors))

      commit(SET_FILES_SORTING, payload.filesSorting)
      localStorage.setItem(
        'filesSorting', JSON.stringify(payload.filesSorting)
      )

      commit(SET_FILES_SORTING_DIRECTION, payload.filesSortingDirection)
      localStorage.setItem(
        'filesSortingDirection', JSON.stringify(payload.filesSortingDirection)
      )

      commit(SET_FILES_SORTING_NAMESPACES, payload.filesSortingNamespaces)
      localStorage.setItem(
        'filesSortingNamespaces',
        JSON.stringify(payload.filesSortingNamespaces)
      )

      commit(SET_TAGS_SORTING, payload.tagsSorting)
      localStorage.setItem(
        'tagsSorting', JSON.stringify(payload.tagsSorting)
      )

      commit(SET_TAGS_SORTING_DIRECTION, payload.tagsSortingDirection)
      localStorage.setItem(
        'tagsSortingDirection', JSON.stringify(payload.tagsSortingDirection)
      )
    }
  },
  getters: {
    currentColors: (state, getters, rootState) => {
      const colors = []

      for (const namespace of rootState.tags.namespaces) {
        const available = state.colors.find(
          color => color.name === namespace.name
        )

        colors.push({
          name: namespace.name,
          color: available ? available.color : config.fallbackTagColor
        })
      }

      return colors
    }
  }
}
