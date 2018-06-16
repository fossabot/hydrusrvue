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
            id="sorting-size"
            value="size"
            v-model="localSorting">
          <label for="sorting-size">Sort by filesize</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-width"
            value="width"
            v-model="localSorting">
          <label for="sorting-width">Sort by width</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-height"
            value="height"
            v-model="localSorting">
          <label for="sorting-height">Sort by height</label>
        </div>

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-mime"
            value="mime"
            v-model="localSorting">
          <label for="sorting-mime">Sort by MIME type</label>
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

        <div class="field">
          <input
            type="radio"
            class="is-checkradio is-aligned"
            id="sorting-namespaces"
            value="namespaces"
            v-model="localSorting">
          <label for="sorting-namespaces">Sort by namespaces</label>
        </div>

        <div class="namespace-sorting panel" v-if="sorting === 'namespaces'">

          <p class="panel-heading">
            Namespaces
          </p>

          <draggable v-model="localSortingNamespaces">
            <div
              class="panel-block sortable"
              v-for="(namespace, index) in localSortingNamespaces"
              :key="index">
              <span class="namespace">{{ namespace }}</span>
              <button
                type="button"
                class="delete is-small is-pulled-right"
                @click="removeNamespace(index)"></button>
            </div>
          </draggable>

          <div class="panel-block">
            <input
              type="text"
              class="input"
              v-model="newNamespace"
              @keydown.enter.prevent="addNamespace">
            <button
              type="button"
              class="button is-primary"
              @click="addNamespace">
              Add
            </button>
          </div>

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
import Draggable from 'vuedraggable'
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
    },
    sortingNamespaces: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      isOpen: false,
      newNamespace: ''
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
    localSortingNamespaces: {
      get: function () {
        return this.sortingNamespaces
      },
      set: function (localSortingNamespaces) {
        this.$emit('update:sortingNamespaces', localSortingNamespaces)
      }
    },
    sortingDisplay: function () {
      switch (this.localSorting) {
        case 'size':
          return `filesize | ${this.sortingDirectionDisplay}`
        case 'width':
          return `width | ${this.sortingDirectionDisplay}`
        case 'height':
          return `height | ${this.sortingDirectionDisplay}`
        case 'mime':
          return `mime type | ${this.sortingDirectionDisplay}`
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
    },
    addNamespace: function () {
      if (this.newNamespace.trim() !== '') {
        this.localSortingNamespaces.push(
          this.newNamespace.trim().split(' ').join('_')
        )

        this.newNamespace = ''
      }
    },
    removeNamespace: function (index) {
      if (this.localSortingNamespaces.length > 1) {
        this.localSortingNamespaces.splice(index, 1)
      }
    }
  },
  components: {
    Draggable,
    FontAwesomeIcon
  }
}
</script>
