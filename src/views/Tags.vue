<template>
  <div class="wrapper">

    <vue-headful :title="title" />

    <section class="section">

      <search
        :isLoading="isLoading"
        :lastQuery="lastQuery"
        :wantsAdditionalTags="wantsAdditionalTags" />

      <hr>

      <div class="table-container" v-if="formattedTags.length">

        <table class="tags-table table is-fullwidth is-striped is-hoverable">

          <thead>
            <tr>
              <th>tag</th>
              <th>files</th>
            </tr>
          </thead>

          <tbody>

            <tr v-for="tag in formattedTags" :key="tag.name">
              <td>
                <router-link
                  :to="{ path: tag.path, query: tag.query }"
                  :style="{ color: tag.color }">
                  {{ tag.name }}
                </router-link>
              </td>
              <td>
                {{ tag.files }}
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <p v-if="!isLoading && !formattedTags.length && !lastQuery">
        No search started.
      </p>

      <p v-if="!isLoading && !formattedTags.length && lastQuery">
        No tags found.
      </p>

      <div class="has-text-centered" v-if="isLoading">
        <span class="icon is-large has-text-primary">
          <font-awesome-icon icon="spinner" class="fa-pulse fa-2x" />
        </span>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import throttle from 'lodash/throttle'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import config from '@/config'
import queryFormatter from '@/helpers/query-formatter'
import tagFormatter from '@/helpers/tag-formatter'

import Search from '@/components/tags/Search'

let scrollListener

export default {
  name: 'Tags',
  data: function () {
    return {
      wantsAdditionalTags: false,
      title: `tags – ${config.title}`
    }
  },
  computed: {
    formattedTags: function () {
      const tags = []

      for (const tag of this.tags) {
        const name = tagFormatter.formatForApp(tag.name)

        tags.push({
          name: name,
          path: '/files',
          query: queryFormatter.generateDefaultFilesQuery(name),
          color: tagFormatter.getColor(
            name, this.colors
          ),
          files: tag.files
        })
      }

      return tags
    },
    ...mapState({
      tags: state => state.tags.items,
      isLoading: state => state.tags.isLoading,
      lastQuery: state => state.tags.lastQuery,
      colors: state => state.settings.colors
    })
  },
  methods: {
    bottomIsVisible: function () {
      const scrollY = window.scrollY
      const isVisible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const isAtbottomOfPage = (isVisible + scrollY) >= pageHeight

      return isAtbottomOfPage || (pageHeight < isVisible)
    }
  },
  created: function () {
    scrollListener = throttle(() => {
      this.wantsAdditionalTags = this.bottomIsVisible()
    }, 50)

    window.addEventListener('scroll', scrollListener)
  },
  beforeRouteLeave: function (to, from, next) {
    window.removeEventListener('scroll', scrollListener)

    next()
  },
  components: {
    FontAwesomeIcon,
    Search
  }
}
</script>
