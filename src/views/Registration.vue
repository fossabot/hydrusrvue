<template>
  <div class="wrapper">

    <vue-headful :title="title" />

    <section class="section">

      <div class="container">

        <div class="columns is-centered">

          <div class="column is-10-tablet is-8-desktop">

            <article class="message is-danger" v-if="error && error.isLocal">
              <div class="message-header">
                <p>{{ error.name }}</p>
              </div>
              <div class="message-body">
                <p v-html="error.message"></p>
              </div>
            </article>

            <div class="frame">

              <div class="content">

                <h1 class="has-text-primary">Registration</h1>

                <form @submit.prevent="register">

                  <div class="field">
                    <div class="control">
                      <input
                        type="text"
                        class="input"
                        placeholder="username"
                        required
                        maxlength="1024"
                        :disabled="isRegistering"
                        autocomplete="username"
                        v-model="username"
                        v-focus>
                    </div>
                  </div>

                  <div class="field">
                    <div class="control">
                      <input
                        type="password"
                        class="input"
                        placeholder="password"
                        required
                        :minlength="minPasswordLength"
                        maxlength="1024"
                        :disabled="isRegistering"
                        autocomplete="new-password"
                        v-model="password">
                    </div>
                  </div>

                  <div class="field">
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-primary">
                        <span class="icon" v-if="!isRegistering">
                          <font-awesome-icon
                            icon="user-plus"
                            v-if="!isRegistering" />
                        </span>
                        <span class="icon" v-if="isRegistering">
                          <font-awesome-icon icon="spinner" class="fa-pulse" />
                        </span>
                        <span v-if="!isRegistering">Register</span>
                        <span v-if="isRegistering">Registering…</span>
                      </button>
                    </div>
                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import config from '@/config'

export default {
  name: 'Registration',
  data: function () {
    return {
      username: '',
      password: '',
      minPasswordLength: config.minPasswordLength < 1024
        ? config.minPasswordLength
        : 1024,
      title: `registration – ${config.title}`
    }
  },
  computed: {
    ...mapState({
      isRegistering: state => state.auth.creatingUser,
      error: state => state.error
    })
  },
  methods: {
    register: function () {
      if (
        this.isRegistering ||
        this.username.trim() === '' ||
        this.password.trim() === ''
      ) {
        return
      }

      this.createUser({
        username: this.username,
        password: this.password
      })
    },
    ...mapActions({
      createUser: 'auth/createUser'
    })
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
