<template>
  <form @submit.prevent="handleSubmit">

    <div class="columns">

      <div class="column is-5-tablet is-6-desktop">
        <div class="field">
          <div class="control">
            <tags-input
              :tags.sync="tags"
              placeholder="search for files by tags…" />
          </div>
        </div>
      </div>

      <div class="column is-5-tablet is-4-desktop">
        <sorting
          :sorting.sync="sorting"
          :sortingDirection.sync="sortingDirection"
          :sortingNamespaces.sync="sortingNamespaces" />
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

    <div class="file-tags tags" v-if="activeTags.length">
      <span
        class="tag is-medium"
        :style="{ backgroundColor: tag.color }"
        v-for="tag in activeTags"
        :key="tag.name">
        <span>{{ tag.name }}</span>
        <button
          type="button"
          class="delete is-small"
          @click="removeTag(tag.name)"></button>
      </span>
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

import TagsInput from '@/components/general/TagsInput'
import Sorting from '@/components/files/Sorting'

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
    wantsAdditionalFiles: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      isInitialized: false,
      tags: '',
      sorting: this.$store.state.settings.filesSorting,
      sortingDirection: this.$store.state.settings.filesSortingDirection,
      sortingNamespaces: Object.assign(
        [], this.$store.state.settings.filesSortingNamespaces
      ),
      page: 1,
      activeTags: []
    }
  },
  computed: {
    ...mapState({
      hasReachedLastPage: state => state.files.hasReachedLastPage,
      colors: state => state.settings.colors
    })
  },
  methods: {
    initialize: function () {
      if (!isEmpty(this.$route.query)) {
        this.page = queryFormatter.ensureValidPage(this.$route.query.page)

        if (this.$route.query.tags) {
          this.tags = this.$route.query.tags.join(' ')

          this.setTags()
        }

        if (
          ['id', 'size', 'width', 'height', 'mime', 'random', 'namespaces']
            .includes(
              this.$route.query.sort
            )
        ) {
          this.sorting = this.$route.query.sort

          if (this.$route.query.sort === 'namespaces') {
            if (this.$route.query.namespaces) {
              this.sortingNamespaces = this.$route.query.namespaces
            } else {
              this.sorting = 'id'
            }
          }
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

          this.loadFiles(false)
        }

        this.blur()

        this.finishInitialization()

        return
      }

      this.emptyFiles()
      this.unsetLastQuery()

      this.loadFiles(false)

      this.finishInitialization()
    },
    handleSubmit: function () {
      this.blur()

      this.page = 1

      this.loadFiles(false)
    },
    updateQueryAndGetStrings: function () {
      const query = queryFormatter.generateFilesQuery(
        this.tags,
        this.sorting,
        this.sortingDirection,
        this.sortingNamespaces,
        this.page
      )

      const sanitizedQuery = Object.assign({}, query)

      if (sanitizedQuery.tags) {
        sanitizedQuery.tags = sanitizedQuery.tags.map(
          tag => tagFormatter.formatForApi(tag)
        )
      }

      if (sanitizedQuery.direction && sanitizedQuery.direction === 'default') {
        delete sanitizedQuery.direction
      }

      if (sanitizedQuery.namespaces) {
        sanitizedQuery.namespaces = sanitizedQuery.namespaces.map(
          namespace => tagFormatter.formatForApi(namespace)
        )
      }

      this.$router.replace({
        path: '/files',
        query: query
      })

      return {
        queryString: qs.stringify(query, { addQueryPrefix: true }),
        sanitizedQueryString: qs.stringify(
          sanitizedQuery, { addQueryPrefix: true }
        )
      }
    },
    loadFiles: function (fetchNextPage) {
      this.setTags()

      const queryStrings = this.updateQueryAndGetStrings()

      this.setLastQuery(queryStrings.queryString)

      if (fetchNextPage) {
        this.fetchNextPage(queryStrings.sanitizedQueryString)

        return
      }

      this.fetchFiles(queryStrings.sanitizedQueryString)
    },
    setTags: function () {
      this.activeTags = []

      if (this.tags.length) {
        const tags = this.tags
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag.length)
          .filter((tag, i, tags) => tags.indexOf(tag) === i)

        for (const tag of tags) {
          this.activeTags.push({
            name: tag,
            color: tagFormatter.getColor(tag, this.colors)
          })
        }
      }
    },
    removeTag: function (tag) {
      for (let i = 0; i < this.activeTags.length; i++) {
        if (this.activeTags[i].name === tag) {
          this.activeTags.splice(i, 1)
        }
      }

      this.tags = this.activeTags.map(tag => tag.name).join(' ')

      this.handleSubmit()
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
      fetchFiles: 'files/fetch',
      fetchNextPage: 'files/fetchNextPage',
      emptyFiles: 'files/empty',
      setLastQuery: 'files/setLastQuery',
      unsetLastQuery: 'files/unsetLastQuery'
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
    sortingNamespaces: function () {
      if (!this.isInitialized) {
        return
      }

      this.handleSubmit()
    },
    wantsAdditionalFiles: function (wantsAdditionalFiles) {
      if (
        !isEmpty(this.$route.query) &&
        wantsAdditionalFiles &&
        !this.isLoading &&
        !this.hasReachedLastPage
      ) {
        this.page++

        this.loadFiles(true)
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
    TagsInput,
    Sorting
  }
}
</script>
