import cookies from 'js-cookie'

import {
  AUTHORIZE,
  DEAUTHORIZE,
  SET_CREATING_USER,
  UNSET_CREATING_USER,
  SET_UPDATING_USERNAME,
  UNSET_UPDATING_USERNAME,
  SET_UPDATED_USERNAME,
  UNSET_UPDATED_USERNAME,
  SET_UPDATING_PASSWORD,
  UNSET_UPDATING_PASSWORD,
  SET_UPDATED_PASSWORD,
  UNSET_UPDATED_PASSWORD,
  SET_DELETING_USER,
  UNSET_DELETING_USER,
  SET_AUTHORIZING,
  UNSET_AUTHORIZING
} from '@/store/mutation-types'
import router from '@/router'
import api from '@/api'
import errorHandler from '@/helpers/error-handler'

export default {
  namespaced: true,
  state: {
    isAuthorized: (
      (typeof cookies.get('token') !== 'undefined') &&
      (typeof cookies.get('mediaToken') !== 'undefined')
    ),
    isCreatingUser: false,
    isUpdatingUsername: false,
    hasUpdatedUsername: false,
    isUpdatingPassword: false,
    hasUpdatedPassword: false,
    isDeletingUser: false,
    isAuthorizing: false,
    token: cookies.get('token'),
    mediaToken: cookies.get('mediaToken')
  },
  mutations: {
    [AUTHORIZE] (state, payload) {
      state.isAuthorized = payload.isAuthorized
      state.token = payload.token
      state.mediaToken = payload.mediaToken
    },
    [DEAUTHORIZE] (state) {
      state.isAuthorized = false
      state.token = null
      state.mediaToken = null
    },
    [SET_CREATING_USER] (state) {
      state.isCreatingUser = true
    },
    [UNSET_CREATING_USER] (state) {
      state.isCreatingUser = false
    },
    [SET_UPDATING_USERNAME] (state) {
      state.isUpdatingUsername = true
    },
    [UNSET_UPDATING_USERNAME] (state) {
      state.isUpdatingUsername = false
    },
    [SET_UPDATED_USERNAME] (state) {
      state.hasUpdatedUsername = true
    },
    [UNSET_UPDATED_USERNAME] (state) {
      state.hasUpdatedUsername = false
    },
    [SET_UPDATING_PASSWORD] (state) {
      state.isUpdatingPassword = true
    },
    [UNSET_UPDATING_PASSWORD] (state) {
      state.isUpdatingPassword = false
    },
    [SET_UPDATED_PASSWORD] (state) {
      state.hasUpdatedPassword = true
    },
    [UNSET_UPDATED_PASSWORD] (state) {
      state.hasUpdatedPassword = false
    },
    [SET_DELETING_USER] (state) {
      state.isDeletingUser = true
    },
    [UNSET_DELETING_USER] (state) {
      state.isDeletingUser = false
    },
    [SET_AUTHORIZING] (state) {
      state.isAuthorizing = true
    },
    [UNSET_AUTHORIZING] (state) {
      state.isAuthorizing = false
    }
  },
  actions: {
    checkAuthorization (context) {
      context.dispatch('error/flush', false, { root: true })

      if (!context.state.token) {
        return
      }

      return api.fetchInfo(context.state.token)
        .then(async res => {
          context.dispatch('api/setInfo', res.data, { root: true })
          await context.dispatch('tags/fetchNamespaces', false, { root: true })
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
    },
    checkCookie ({ commit, state }) {
      if (!state.isAuthorized) {
        return
      }

      if (!(cookies.get('token') && cookies.get('mediaToken'))) {
        commit(DEAUTHORIZE)

        errorHandler.handle(
          { data: { error: 'InvalidTokenError' } },
          [{ name: 'InvalidTokenError', isFatal: false, isLocal: false }]
        )
      }
    },
    createUser (context, payload) {
      context.commit(SET_CREATING_USER)

      context.dispatch('error/flush', false, { root: true })

      api.createUser({
        username: payload.username,
        password: payload.password
      })
        .then(res => {
          context.dispatch(
            'authorize',
            {
              username: payload.username,
              password: payload.password,
              long: false
            }
          )
        })
        .catch(async err => {
          await errorHandler.handle(
            err.response,
            [
              {
                name: 'RegistrationDisabledError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'MissingUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'MissingPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'UsernameExistsError',
                isFatal: false,
                isLocal: true
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

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })

          context.commit(UNSET_CREATING_USER)
        })
    },
    deleteUser (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(SET_DELETING_USER)

      api.deleteUser(
        {
          password: payload.currentPassword
        },
        context.state.token
      )
        .then(res => {
          context.dispatch('deauthorize')
        })
        .catch(async err => {
          await errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              {
                name: 'MissingPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              { name: 'InvalidUserError', isFatal: false, isLocal: true },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        .finally(() => {
          context.commit(UNSET_DELETING_USER)
        })
    },
    updateUsername (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(SET_UPDATING_USERNAME)

      api.updateUser(
        {
          username: payload.newUsername,
          currentPassword: payload.currentPassword
        },
        context.state.token
      )
        .then(res => {
          context.commit(UNSET_UPDATING_USERNAME)
          context.commit(SET_UPDATED_USERNAME)

          setTimeout(() => {
            context.commit(UNSET_UPDATED_USERNAME)
          }, 2000)
        })
        .catch(async err => {
          await errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              { name: 'NoUpdateFieldsError', isFatal: false, isLocal: true },
              {
                name: 'MissingUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'MissingCurrentPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidCurrentPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              { name: 'InvalidUserError', isFatal: false, isLocal: true },
              { name: 'UsernameExistsError', isFatal: false, isLocal: true },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        .finally(() => {
          context.commit(UNSET_UPDATING_USERNAME)
        })
    },
    updatePassword (context, payload) {
      context.dispatch('error/flush', false, { root: true })

      context.commit(SET_UPDATING_PASSWORD)

      api.updateUser(
        {
          password: payload.newPassword,
          currentPassword: payload.currentPassword
        },
        context.state.token
      )
        .then(res => {
          context.commit(UNSET_UPDATING_PASSWORD)
          context.commit(SET_UPDATED_PASSWORD)

          setTimeout(() => {
            context.commit(UNSET_UPDATED_PASSWORD)
          }, 2000)
        })
        .catch(async err => {
          await errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              { name: 'NoUpdateFieldsError', isFatal: false, isLocal: true },
              {
                name: 'MissingPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'MissingCurrentPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidCurrentPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              { name: 'InvalidUserError', isFatal: false, isLocal: true },
              { name: 'UsernameExistsError', isFatal: false, isLocal: true },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        .finally(() => {
          context.commit(UNSET_UPDATING_PASSWORD)
        })
    },
    authorize (context, payload) {
      context.commit(SET_AUTHORIZING)

      context.dispatch('error/flush', false, { root: true })

      api.authorize({
        username: payload.username,
        password: payload.password,
        long: payload.long
      })
        .then(async res => {
          const expires = payload.long
            ? new Date(new Date().getTime() + 129595 * 60 * 1000)
            : new Date(new Date().getTime() + 1435 * 60 * 1000)

          cookies.set('token', res.data.token, { expires: expires })
          cookies.set('mediaToken', res.data.mediaToken, { expires: expires })

          context.commit(
            AUTHORIZE,
            {
              isAuthorized: true,
              token: res.data.token,
              mediaToken: res.data.mediaToken
            }
          )

          await context.dispatch('checkAuthorization')

          router.push('/')
        })
        .catch(async err => {
          await errorHandler.handle(
            err.response,
            [
              {
                name: 'MissingUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidUsernameFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'MissingPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              {
                name: 'InvalidPasswordFieldError',
                isFatal: false,
                isLocal: true
              },
              { name: 'InvalidLongFieldError', isFatal: false, isLocal: true },
              { name: 'InvalidUserError', isFatal: false, isLocal: true },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        .finally(() => {
          context.commit(UNSET_AUTHORIZING)
          context.commit(UNSET_CREATING_USER)
        })
    },
    async deauthorize ({ commit, state }, payload) {
      cookies.remove('token')
      cookies.remove('mediaToken')

      if (state.token) {
        await api.deauthorize({ all: payload }, state.token)
          .then(() => {
            commit(DEAUTHORIZE)
          })
          .catch(() => {
            commit(DEAUTHORIZE)
          })
      } else {
        commit(DEAUTHORIZE)
      }

      router.push('/login')
    }
  },
  getters: {
    mediaTokenQueryString: state => {
      return state.mediaToken ? `?token=${state.mediaToken}` : ''
    }
  }
}
