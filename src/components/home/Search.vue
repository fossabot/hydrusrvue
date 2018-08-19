<template>
  <form @submit.prevent="handleSubmit">

    <div class="columns">

      <div class="column is-9">
        <div class="field">
          <div class="control">
            <tags-input
              :tags.sync="tags"
              size="is-medium"
              placeholder="search for files by tags…" />
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="field">
          <div class="control">
            <button
              type="submit"
              class="button is-primary is-medium is-fullwidth">
              <span class="icon">
                <font-awesome-icon icon="search" />
              </span>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

    </div>

  </form>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import queryFormatter from '@/helpers/query-formatter'

import TagsInput from '@/components/general/TagsInput'

export default {
  name: 'Search',
  data: function () {
    return {
      tags: ''
    }
  },
  methods: {
    handleSubmit: function () {
      this.$router.push({
        path: '/files',
        query: queryFormatter.generateDefaultFilesQuery(this.tags)
      })
    }
  },
  components: {
    FontAwesomeIcon,
    TagsInput
  }
}
</script>
