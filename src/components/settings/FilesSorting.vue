<template>
  <div class="settings-sorting settings-block">

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
        id="sorting-files-default"
        value="id"
        v-model="localSorting">
      <label for="sorting-files-default">Sort by ID</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-size"
        value="size"
        v-model="localSorting">
      <label for="sorting-files-size">Sort by filesize</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-width"
        value="width"
        v-model="localSorting">
      <label for="sorting-files-width">Sort by width</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-height"
        value="height"
        v-model="localSorting">
      <label for="sorting-files-height">Sort by height</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-mime"
        value="mime"
        v-model="localSorting">
      <label for="sorting-files-mime">Sort by MIME type</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-random"
        value="random"
        v-model="localSorting">
      <label for="sorting-files-random">Sort randomly</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-files-namespaces"
        value="namespaces"
        v-model="localSorting">
      <label for="sorting-files-namespaces">Sort by namespaces</label>
    </div>

    <div class="namespace-sorting panel" v-if="localSorting === 'namespaces'">

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
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'FilesSorting',
  props: {
    filesSorting: {
      type: String,
      required: true
    },
    filesSortingDirection: {
      type: String,
      required: true
    },
    filesSortingNamespaces: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      newNamespace: ''
    }
  },
  computed: {
    localSorting: {
      get: function () {
        return this.filesSorting
      },
      set: function (localSorting) {
        this.$emit('update:filesSorting', localSorting)
      }
    },
    localSortingDirection: {
      get: function () {
        return this.filesSortingDirection
      },
      set: function (localSortingDirection) {
        this.$emit('update:filesSortingDirection', localSortingDirection)
      }
    },
    localSortingNamespaces: {
      get: function () {
        return this.filesSortingNamespaces
      },
      set: function (localSortingNamespaces) {
        this.$emit('update:filesSortingNamespaces', localSortingNamespaces)
      }
    }
  },
  methods: {
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
    Draggable
  }
}
</script>
