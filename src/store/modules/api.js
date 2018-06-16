import { SET_API_STATUS, SET_API_INFO } from '@/store/mutation-types'
import api from '@/api'
import errorHandler from '@/helpers/error-handler'

export default {
  namespaced: true,
  state: {
    isAvailable: false,
    version: null,
    tagCount: null,
    fileCount: null
  },
  mutations: {
    [SET_API_STATUS] (state, payload) {
      state.isAvailable = true
      state.version = `hydrusrv@${payload.version}`
    },
    [SET_API_INFO] (state, payload) {
      state.tagCount = payload.tagCount
      state.fileCount = payload.fileCount
    }
  },
  actions: {
    fetchStatus ({ commit, dispatch }) {
      dispatch('error/flush', false, { root: true })

      return api.fetchApiStatus()
        .then(res => {
          commit(SET_API_STATUS, res.data.hydrusrv)
        })
        .catch(err => {
          errorHandler.handle(err.response)
        })
    },
    setInfo ({ commit }, payload) {
      commit(SET_API_INFO, payload)
    }
  }
}
