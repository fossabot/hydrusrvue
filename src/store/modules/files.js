import {
  SET_FILES_LOADING,
  UNSET_FILES_LOADING,
  SET_FILES,
  APPEND_FILES,
  UNSET_FILES,
  SET_LAST_FILES_QUERY,
  UNSET_LAST_FILES_QUERY,
  SET_LAST_FILES_PAGE_REACHED,
  UNSET_LAST_FILES_PAGE_REACHED,
  SET_DETAIL_ITEM,
  UNSET_DETAIL_ITEM,
  SET_LAST_DETAIL_ID
} from '@/store/mutation-types'
import api from '@/api'
import errorHandler from '@/helpers/error-handler'

export default {
  namespaced: true,
  state: {
    items: [],
    isLoading: false,
    lastQuery: null,
    hasReachedLastPage: false,
    detailItem: null,
    lastDetailId: null
  },
  mutations: {
    [SET_FILES] (state, payload) {
      state.items = payload
    },
    [APPEND_FILES] (state, payload) {
      state.items = state.items.concat(payload)
    },
    [UNSET_FILES] (state) {
      state.items = []
    },
    [SET_FILES_LOADING] (state) {
      state.isLoading = true
    },
    [UNSET_FILES_LOADING] (state) {
      state.isLoading = false
    },
    [SET_LAST_FILES_QUERY] (state, payload) {
      state.lastQuery = payload
    },
    [UNSET_LAST_FILES_QUERY] (state) {
      state.lastQuery = null
    },
    [SET_LAST_FILES_PAGE_REACHED] (state) {
      state.hasReachedLastPage = true
    },
    [UNSET_LAST_FILES_PAGE_REACHED] (state) {
      state.hasReachedLastPage = false
    },
    [SET_DETAIL_ITEM] (state, payload) {
      state.detailItem = payload
    },
    [UNSET_DETAIL_ITEM] (state) {
      state.detailItem = null
    },
    [SET_LAST_DETAIL_ID] (state, payload) {
      state.lastDetailId = payload
    }
  },
  actions: {
    fetch (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(UNSET_FILES)
      context.commit(UNSET_LAST_FILES_PAGE_REACHED)
      context.commit(SET_FILES_LOADING)

      return api.fetchFiles(payload, context.rootState.auth.token)
        .then(res => {
          if (!res.data.length) {
            context.commit(SET_LAST_FILES_PAGE_REACHED)

            return
          }

          context.commit(SET_FILES, res.data)
        })
        .catch(err => {
          errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              {
                name: 'MissingPageParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidPageParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidTagsParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidSortParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidDirectionParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'MissingNamespacesParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidNamespacesParameterError',
                isFatal: false,
                isLocal: false
              },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })
        .finally(() => {
          context.commit(UNSET_FILES_LOADING)
        })
    },
    fetchNextPage (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(SET_FILES_LOADING)

      return api.fetchFiles(payload, context.rootState.auth.token)
        .then(res => {
          if (!res.data.length) {
            context.commit(SET_LAST_FILES_PAGE_REACHED)

            return
          }

          context.commit(APPEND_FILES, res.data)
        })
        .catch(err => {
          errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              {
                name: 'MissingPageParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidPageParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidTagsParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidSortParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidDirectionParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'MissingNamespacesParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidNamespacesParameterError',
                isFatal: false,
                isLocal: false
              },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })
        .finally(() => {
          context.commit(UNSET_FILES_LOADING)
        })
    },
    empty ({ commit }) {
      commit(UNSET_FILES)
    },
    setLastQuery ({ commit }, payload) {
      commit(SET_LAST_FILES_QUERY, payload)
    },
    unsetLastQuery ({ commit }) {
      commit(UNSET_LAST_FILES_QUERY)
    },
    unsetLastPageReached (context) {
      context.commit(UNSET_LAST_FILES_PAGE_REACHED)
    },
    fetchDetail (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(UNSET_DETAIL_ITEM)
      context.commit(SET_FILES_LOADING)

      return api.fetchFile(payload, context.rootState.auth.token)
        .then(res => {
          context.commit(SET_DETAIL_ITEM, res.data)
        })
        .catch(err => {
          errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              {
                name: 'MissingIdParameterError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidIdParameterError',
                isFatal: false,
                isLocal: false
              },
              { name: 'NotFoundError', isFatal: false, isLocal: false },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })
        .finally(() => {
          context.commit(UNSET_FILES_LOADING)
        })
    },
    setLastDetailId ({ commit }, payload) {
      commit(SET_LAST_DETAIL_ID, payload)
    }
  },
  getters: {
    sortedDetailItemTags: state => {
      if (!state.detailItem) {
        return []
      }

      const unsortedTags = state.detailItem.tags.slice()
      const sortedTags = []

      for (let i = 0; i < unsortedTags.length; i++) {
        if (
          (!unsortedTags[i].name.startsWith(':')) &&
          (!unsortedTags[i].name.endsWith(':')) &&
          unsortedTags[i].name.includes(':')
        ) {
          sortedTags.push(unsortedTags[i])
          unsortedTags[i] = ''
        }
      }

      return sortedTags.concat(unsortedTags.filter(tag => tag !== ''))
    }
  }
}
