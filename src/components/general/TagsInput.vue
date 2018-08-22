<template>
  <div v-on-clickaway="stopCompleting">

    <input
      type="text"
      class="input"
      :class="size"
      ref="tags"
      :placeholder="placeholder"
      @focus="isTyping = true"
      @keydown.tab="stopCompleting"
      @keydown.down.prevent="setFocus(0)"
      @keyup="updateCursorPosition($event.target.selectionStart)"
      @click="updateCursorPosition($event.target.selectionStart)"
      v-model="localTags"
      v-focus>

    <div
      class="suggestions dropdown"
      :class="{ 'is-active': isTyping && !isSearching && suggestions.length }"
      v-if="isTyping && !isSearching && suggestions.length">
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <a
            class="dropdown-item"
            href="#"
            ref="suggestions"
            :style="{ color: suggestion.color }"
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @keydown.up.prevent="setFocus(index - 1)"
            @keydown.down.prevent="setFocus(index + 1)"
            @keydown.tab.prevent="setFocus(index)"
            @click.prevent="completePartialTag(suggestion.name)"
            @keyup.enter.prevent="completePartialTag(suggestion.name)">
            {{ suggestion.name }}
            <small class="file-amount">{{ suggestion.fileCount }}</small>
            </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import debounce from 'lodash/debounce'

import api from '@/api'
import errorHandler from '@/helpers/error-handler'
import tagFormatter from '@/helpers/tag-formatter'

export default {
  name: 'TagsInput',
  mixins: [clickaway],
  props: {
    tags: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      isTyping: false,
      isSearching: false,
      cursorPosition: 0,
      partialTag: {},
      suggestions: []
    }
  },
  computed: {
    localTags: {
      get: function () {
        return this.tags
      },
      set: function (localTags) {
        this.$emit('update:tags', localTags)
      }
    },
    ...mapState({
      colors: state => state.settings.colors,
      token: state => state.auth.token
    })
  },
  methods: {
    updateCursorPosition: function (cursorPosition) {
      this.cursorPosition = cursorPosition
    },
    tryCompletion: function () {
      this.isSearching = true

      const partialTag = this.extractSingleTag()

      if (partialTag.name === '') {
        this.isSearching = false
        this.partialTag = { start: 0, end: 0, name: '' }
        this.suggestions = []

        return
      }

      if (partialTag.name === this.partialTag.name) {
        this.isSearching = false

        return
      }

      this.partialTag = partialTag

      this.fetchSuggestions()
    },
    extractSingleTag: function () {
      if (
        (this.cursorPosition === 0) ||
        (this.localTags[this.cursorPosition] === ' ') ||
        (this.localTags[this.cursorPosition - 1] === ' ')
      ) {
        return { start: 0, end: 0, name: '' }
      }

      const tagsStringLength = this.localTags.length

      let start = this.localTags[this.cursorPosition] === ' '
        ? this.cursorPosition - 1
        : this.cursorPosition
      let end = this.cursorPosition

      while (start > 0 && this.localTags[start] !== ' ') {
        start--
      }

      while (end < tagsStringLength && this.localTags[end] !== ' ') {
        end++
      }

      return {
        start: this.localTags[start] === ' ' ? start + 1 : start,
        end: end,
        name: tagFormatter.formatForApi(this.localTags.substring(start, end))
      }
    },
    fetchSuggestions: function () {
      this.suggestions = []

      const body = {
        partialTag: this.partialTag.name
      }

      api.autocompleteTag(body, this.token)
        .then(res => {
          res.data = res.data.filter(
            suggestion => !this.localTags.split(' ').includes(
              suggestion.name.split(' ').join('_')
            )
          )

          for (const suggestion of res.data) {
            suggestion.name = tagFormatter.formatForApp(suggestion.name)
            suggestion.color = tagFormatter.getColor(
              suggestion.name, this.colors
            )
          }

          this.suggestions = res.data
        })
        .catch(err => {
          errorHandler.handle(
            err.response,
            [
              { name: 'MissingTokenError', isFatal: false, isLocal: false },
              { name: 'InvalidTokenError', isFatal: false, isLocal: false },
              {
                name: 'MissingPartialTagFieldError',
                isFatal: false,
                isLocal: false
              },
              {
                name: 'InvalidPartialTagFieldError',
                isFatal: false,
                isLocal: false
              },
              { name: 'ShuttingDownError', isFatal: true, isLocal: false },
              { name: 'InternalServerError', isFatal: true, isLocal: false }
            ]
          )
        })

      this.isSearching = false
    },
    completePartialTag: function (suggestion) {
      const localTagsChars = this.localTags.split('')

      localTagsChars.splice(
        this.partialTag.start,
        this.partialTag.end - this.partialTag.start,
        suggestion
      )

      this.localTags = localTagsChars.join('')

      this.partialTag = { start: 0, end: 0, name: '' }
      this.suggestions = []

      this.$refs.tags.focus()
    },
    stopCompleting: function () {
      this.isTyping = false
      this.partialTag = { start: 0, end: 0, name: '' }
      this.suggestions = []
    },
    setFocus: function (index) {
      if (this.suggestions.length) {
        this.$nextTick(() => {
          if (index === -1) {
            this.$refs.tags.focus()

            return
          }

          if (index >= this.suggestions.length) {
            return
          }

          this.$refs.suggestions[index].focus()
        })
      }
    }
  },
  watch: {
    cursorPosition: function () {
      this.debouncedCompletion()
    }
  },
  created: function () {
    this.debouncedCompletion = debounce(function () {
      this.tryCompletion()
    }, 50)
  }
}
</script>
