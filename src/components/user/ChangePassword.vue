<template>
  <form @submit.prevent="changePassword">

    <div class="field">
      <div class="control">
        <input
          type="password"
          class="input"
          placeholder="new password"
          required
          :minlength="minPasswordLength"
          maxlength="1024"
          :disabled="isWorking || hasSaved"
          autocomplete="new-password"
          v-model="newPassword">
      </div>
    </div>

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
          class="button"
          :class="{
            'is-primary': !hasUpdatedPassword,
            'is-success': hasUpdatedPassword
          }"
          :disabled="isUpdatingUsername ||
            hasUpdatedUsername ||
            isDeletingUser
          ">
          <span
            class="icon"
            v-if="!(isUpdatingPassword || hasUpdatedPassword)">
            <font-awesome-icon icon="save" />
          </span>
          <span class="icon" v-if="isUpdatingPassword">
            <font-awesome-icon icon="spinner" class="fa-pulse" />
          </span>
          <span class="icon" v-if="hasUpdatedPassword">
            <font-awesome-icon icon="check" />
          </span>
          <span v-if="!(isUpdatingPassword || hasUpdatedPassword)">
            Save
          </span>
          <span v-if="isUpdatingPassword">Saving…</span>
          <span v-if="hasUpdatedPassword">Saved</span>
        </button>
      </div>
    </div>

  </form>
</template>

<script>
import { mapActions } from 'vuex'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import config from '@/config'

export default {
  name: 'ChangePassword',
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
      newPassword: '',
      currentPassword: ''
    }
  },
  computed: {
    minPasswordLength: function () {
      return config.minPasswordLength < 1024 ? config.minPasswordLength : 1024
    }
  },
  methods: {
    changePassword: function () {
      if (
        this.isWorking ||
        this.hasSaved ||
        this.newPassword.trim() === '' ||
        this.currentPassword.trim() === '' ||
        this.currentPassword.length < this.minPasswordLength
      ) {
        return
      }

      this.updatePassword({
        newPassword: this.newPassword,
        currentPassword: this.currentPassword
      })
    },
    ...mapActions({
      updatePassword: 'auth/updatePassword'
    })
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
