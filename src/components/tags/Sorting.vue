<template>
  <div>

    <div
      class="quickview-blocker"
      @click="isOpen = false"
      v-if="isOpen"></div>

    <div class="quickview" :class="{ 'is-active': isOpen }">

      <header class="quickview-header">
        <p class="title">Sorting</p>
        <button
          type="button"
          class="delete"
          @click="isOpen = false"></button>
      </header>

      <div class="quickview-body">

        <div class="field has-addons" v-if="localSorting !== 'random'">
          <div class="control">
            <button class="button is-static">Direction</button>
          </div>
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="localSortingDirection">
                <option value="default">Default (based on the field)</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-default"
            value="id"
            v-model="localSorting">
          <label for="sorting-default">Sort by ID</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-name"
            value="name"
            v-model="localSorting">
          <label for="sorting-name">Sort by name</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-files"
            value="files"
            v-model="localSorting">
          <label for="sorting-files">Sort by amount of files</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-contains"
            value="contains"
            v-model="localSorting">
          <label for="sorting-contains">
            Sort by given word (starting with)
          </label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-random"
            value="random"
            v-model="localSorting">
          <label for="sorting-random">Sort randomly</label>
        </div>

      </div>

    </div>

    <div class="sorting-field field has-addons">
      <div class="control">
        <a class="button is-static">Sorting</a>
      </div>
      <div class="control is-expanded">
        <input
          type="text"
          class="input"
          readonly
          v-model="sortingDisplay"
          @click="openSettings">
      </div>
    </div>

  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'Sorting',
  props: {
    sorting: {
      type: String,
      required: true
    },
    sortingDirection: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  computed: {
    localSorting: {
      get: function () {
        return this.sorting
      },
      set: function (localSorting) {
        this.$emit('update:sorting', localSorting)
      }
    },
    localSortingDirection: {
      get: function () {
        return this.sortingDirection
      },
      set: function (localSortingDirection) {
        this.$emit('update:sortingDirection', localSortingDirection)
      }
    },
    sortingDisplay: function () {
      switch (this.localSorting) {
        case 'name':
          return `name | ${this.sortingDirectionDisplay}`
        case 'files':
          return `amount of files | ${this.sortingDirectionDisplay}`
        case 'contains':
          return `given word | ${this.sortingDirectionDisplay}`
        case 'random':
          return 'random'
        case 'namespaces':
          return this.localSortingNamespaces.join(' – ') +
            ` | ${this.sortingDirectionDisplay}`
        default:
          return `id | ${this.sortingDirectionDisplay}`
      }
    },
    sortingDirectionDisplay () {
      switch (this.localSortingDirection) {
        case 'asc':
          return 'ascending order'
        case 'desc':
          return 'descending order'
        default:
          return 'default order'
      }
    }
  },
  methods: {
    openSettings: function () {
      document.activeElement.blur()

      this.isOpen = true
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
