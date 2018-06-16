<template>
  <div id="app" class="is-lowercase">
    <navbar
      :isInitialized="isInitialized"
      :isAuthorized="isAuthorized"
      :error="error" />

    <error :error="error" v-if="error.name && !error.isLocal" />

    <spinner v-if="!isInitialized" />

    <router-view
      :isAuthorized="isAuthorized"
      v-if="isInitialized && !error.isFatal" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Navbar from '@/components/general/Navbar'
import Spinner from '@/components/general/Spinner'
import Error from '@/components/general/Error'

export default {
  name: 'App',
  computed: {
    ...mapState({
      isInitialized: state => state.app.isInitialized,
      isAuthorized: state => state.auth.isAuthorized,
      error: state => state.error
    })
  },
  components: {
    Navbar,
    Spinner,
    Error
  }
}
</script>
