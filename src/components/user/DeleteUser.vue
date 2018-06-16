<template>
  <form @submit.prevent="removeUser">

    <div class="field">
      <div class="control">
        <input
          type="password"
          class="input"
          placeholder="current password"
          required
          :disabled="isWorking || hasSaved"
          autocomplete="current-password"
          v-model="currentPassword">
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button
          type="submit"
          class="button is-danger"
          :disabled="
            isUpdatingUsername ||
            hasUpdatedUsername ||
            isUpdatingPassword ||
            hasUpdatedPassword
          ">
          <span
            class="icon"
            v-if="!isDeletingUser">
            <font-awesome-icon icon="trash" />
          </span>
          <span class="icon" v-if="isDeletingUser">
            <font-awesome-icon icon="spinner" class="fa-pulse" />
          </span>
          <span v-if="!isDeletingUser">
            Delete user
          </span>
          <span v-if="isDeletingUser">Deleting user…</span>
        </button>
      </div>
    </div>

  </form>
</template>

<script>
import { mapActions } from 'vuex'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'DeleteUser',
  props: {
    isWorking: {
      type: Boolean,
      required: true
    },
    hasSaved: {
      type: Boolean,
      required: true
    },
    isUpdatingUsername: {
      type: Boolean,
      required: true
    },
    hasUpdatedUsername: {
      type: Boolean,
      required: true
    },
    isUpdatingPassword: {
      type: Boolean,
      required: true
    },
    hasUpdatedPassword: {
      type: Boolean,
      required: true
    },
    isDeletingUser: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      currentPassword: ''
    }
  },
  methods: {
    removeUser: function () {
      if (
        this.isWorking ||
        this.hasSaved ||
        this.currentPassword.trim() === ''
      ) {
        return
      }

      this.deleteUser({ currentPassword: this.currentPassword })
    },
    ...mapActions({
      deleteUser: 'auth/deleteUser'
    })
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
