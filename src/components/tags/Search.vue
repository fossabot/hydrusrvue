<template>
  <form @submit.prevent="handleSubmit">

    <div class="columns">

      <div class="column is-5-tablet is-6-desktop">
        <div class="field">
          <div class="control">
            <input
              type="text"
              class="input"
              placeholder="search for tags containing word…"
              v-model="contains"
              v-focus>
          </div>
        </div>
      </div>

      <div class="column is-5-tablet is-4-desktop">
        <sorting
          :sorting.sync="sorting"
          :sortingDirection.sync="sortingDirection" />
      </div>

      <div class="column is-2">
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary is-fullwidth">
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
import { mapState, mapActions } from 'vuex'
import { isEmpty } from 'lodash/lang'
import qs from 'qs'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import queryFormatter from '@/helpers/query-formatter'
import tagFormatter from '@/helpers/tag-formatter'

import Sorting from '@/components/tags/Sorting'

export default {
  name: 'Search',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    lastQuery: {
      required: true
    },
    wantsAdditionalTags: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      isInitialized: false,
      contains: '',
      sorting: this.$store.state.settings.tagsSorting,
      sortingDirection: this.$store.state.settings.tagsSortingDirection,
      page: 1
    }
  },
  computed: {
    ...mapState({
      hasReachedLastPage: state => state.tags.hasReachedLastPage,
      colors: state => state.settings.colors
    })
  },
  methods: {
    initialize: function () {
      if (!isEmpty(this.$route.query)) {
        if (this.$route.query.contains) {
          this.contains = this.$route.query.contains.trim().split(' ').join('_')
        }

        this.page = queryFormatter.ensureValidPage(this.$route.query.page)

        if (
          ['id', 'name', 'files', 'contains', 'random']
            .includes(
              this.$route.query.sort
            )
        ) {
          this.sorting = this.$route.query.sort
        }

        if (['default', 'asc', 'desc'].includes(this.$route.query.direction)) {
          this.sortingDirection = this.$route.query.direction
        }

        const queryString = qs.stringify(
          this.$route.query,
          { addQueryPrefix: true }
        )

        if (queryString !== this.lastQuery) {
          this.setLastQuery(queryString)

          this.loadTags(false)
        }

        this.blur()

        this.finishInitialization()

        return
      }

      this.emptyTags()
      this.unsetLastQuery()

      this.loadTags(false)

      this.finishInitialization()
    },
    handleSubmit: function () {
      if (document.activeElement !== document.body) {
        document.activeElement.blur()
      }

      this.page = 1

      this.loadTags(false)
    },
    updateQueryAndGetStrings: function () {
      this.contains = this.contains.trim().split(' ').join('_')

      const query = queryFormatter.generateTagsQuery(
        this.contains,
        this.sorting,
        this.sortingDirection,
        this.page
      )

      const sanitizedQuery = Object.assign({}, query)

      if (sanitizedQuery.contains) {
        sanitizedQuery.contains = tagFormatter.formatForApi(
          sanitizedQuery.contains
        )
      }

      if (sanitizedQuery.direction && sanitizedQuery.direction === 'default') {
        delete sanitizedQuery.direction
      }

      this.$router.replace({
        path: '/tags',
        query: query
      })

      return {
        queryString: qs.stringify(query, { addQueryPrefix: true }),
        sanitizedQueryString: qs.stringify(
          sanitizedQuery, { addQueryPrefix: true }
        )
      }
    },
    loadTags: function (fetchNextPage) {
      const queryStrings = this.updateQueryAndGetStrings()

      this.setLastQuery(queryStrings.queryString)

      if (fetchNextPage) {
        this.fetchNextPage(queryStrings.sanitizedQueryString)

        return
      }

      this.fetchTags(queryStrings.sanitizedQueryString)
    },
    finishInitialization: function () {
      /*
       * workaround to delay sorting watchers to not reset page to 1 after
       * loading the view
       * see https://github.com/vuejs/vue/issues/2918#issuecomment-408669914
       */
      setTimeout(() => {
        this.isInitialized = true
      }, 0)
    },
    blur: function () {
      if (document.activeElement !== document.body) {
        document.activeElement.blur()
      }
    },
    ...mapActions({
      fetchTags: 'tags/fetch',
      fetchNextPage: 'tags/fetchNextPage',
      emptyTags: 'tags/empty',
      setLastQuery: 'tags/setLastQuery',
      unsetLastQuery: 'tags/unsetLastQuery'
    })
  },
  watch: {
    sorting: function () {
      if (!this.isInitialized) {
        return
      }

      this.handleSubmit()
    },
    sortingDirection: function () {
      if (!this.isInitialized) {
        return
      }

      this.handleSubmit()
    },
    wantsAdditionalTags: function (wantsAdditionalTags) {
      if (
        !isEmpty(this.$route.query) &&
        wantsAdditionalTags &&
        !this.isLoading &&
        !this.hasReachedLastPage
      ) {
        this.page++

        this.loadTags(true)
      }
    },
    hasReachedLastPage: function (hasReachedLastPage) {
      if (hasReachedLastPage) {
        this.page = (this.page - 1) > 0 ? this.page - 1 : 1

        this.setLastQuery(this.updateQueryAndGetStrings().queryString)
      }
    }
  },
  mounted: function () {
    this.initialize()
  },
  components: {
    FontAwesomeIcon,
    Sorting
  }
}
</script>
