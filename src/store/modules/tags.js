import {
  SET_TAGS_LOADING,
  UNSET_TAGS_LOADING,
  SET_TAGS,
  APPEND_TAGS,
  UNSET_TAGS,
  SET_LAST_TAGS_QUERY,
  UNSET_LAST_TAGS_QUERY,
  SET_LAST_TAGS_PAGE_REACHED,
  UNSET_LAST_TAGS_PAGE_REACHED,
  SET_NAMESPACES
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
    namespaces: []
  },
  mutations: {
    [SET_TAGS] (state, payload) {
      state.items = payload
    },
    [APPEND_TAGS] (state, payload) {
      state.items = state.items.concat(payload)
    },
    [UNSET_TAGS] (state) {
      state.items = []
    },
    [SET_TAGS_LOADING] (state) {
      state.isLoading = true
    },
    [UNSET_TAGS_LOADING] (state) {
      state.isLoading = false
    },
    [SET_LAST_TAGS_QUERY] (state, payload) {
      state.lastQuery = payload
    },
    [UNSET_LAST_TAGS_QUERY] (state) {
      state.lastQuery = null
    },
    [SET_LAST_TAGS_PAGE_REACHED] (state) {
      state.hasReachedLastPage = true
    },
    [UNSET_LAST_TAGS_PAGE_REACHED] (state) {
      state.hasReachedLastPage = false
    },
    [SET_NAMESPACES] (state, payload) {
      state.namespaces = payload
    }
  },
  actions: {
    fetch (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(UNSET_TAGS)
      context.commit(UNSET_LAST_TAGS_PAGE_REACHED)
      context.commit(SET_TAGS_LOADING)

      return api.fetchTags(payload, context.rootState.auth.token)
        .then(res => {
          if (!res.data.length) {
            context.commit(SET_LAST_TAGS_PAGE_REACHED)

            return
          }

          context.commit(SET_TAGS, res.data)
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
                name: 'InvalidContainsParameterError',
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
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })
        .finally(() => {
          context.commit(UNSET_TAGS_LOADING)
        })
    },
    fetchNextPage (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(SET_TAGS_LOADING)

      return api.fetchTags(payload, context.rootState.auth.token)
        .then(res => {
          if (!res.data.length) {
            context.commit(SET_LAST_TAGS_PAGE_REACHED)

            return
          }

          context.commit(APPEND_TAGS, res.data)
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
                name: 'ShuttingDownError',
                isFatal: true,
                isLocal: false
              },
              {
                name: 'InternalServerError',
                isFatal: true,
                isLocal: false
              }
            ]
          )
        })
        .finally(() => {
          context.commit(UNSET_TAGS_LOADING)
        })
    },
    empty ({ commit }) {
      commit(UNSET_TAGS)
    },
    setLastQuery ({ commit }, payload) {
      commit(SET_LAST_TAGS_QUERY, payload)
    },
    unsetLastQuery ({ commit }) {
      commit(UNSET_LAST_TAGS_QUERY)
    },
    unsetLastPageReached (context) {
      context.commit(UNSET_LAST_TAGS_PAGE_REACHED)
    },
    fetchNamespaces (context) {
      context.dispatch('error/flush', false, { root: true })

      return api.fetchNamespaces(context.rootState.auth.token)
        .then(res => {
          const namespaces = res.data
          namespaces.unshift({ name: 'unnamespaced' })

          context.commit(SET_NAMESPACES, namespaces)
        })
        .catch(err => {
          errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })
    }
  }
}
