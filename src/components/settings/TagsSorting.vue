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
        id="sorting-tags-default"
        value="id"
        v-model="localSorting">
      <label for="sorting-tags-default">Sort by ID</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-tags-name"
        value="name"
        v-model="localSorting">
      <label for="sorting-tags-name">Sort by name</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-tags-files"
        value="files"
        v-model="localSorting">
      <label for="sorting-tags-files">Sort by amount of files</label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-tags-contains"
        value="contains"
        v-model="localSorting">
      <label for="sorting-tags-contains">
        Sort by given word (starting with)
      </label>
    </div>

    <div class="field">
      <input
        type="radio"
        class="is-checkradio is-aligned"
        id="sorting-tags-random"
        value="random"
        v-model="localSorting">
      <label for="sorting-tags-random">Sort randomly</label>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TagsSorting',
  props: {
    tagsSorting: {
      type: String,
      required: true
    },
    tagsSortingDirection: {
      type: String,
      required: true
    }
  },
  computed: {
    localSorting: {
      get: function () {
        return this.tagsSorting
      },
      set: function (localSorting) {
        this.$emit('update:tagsSorting', localSorting)
      }
    },
    localSortingDirection: {
      get: function () {
        return this.tagsSortingDirection
      },
      set: function (localSortingDirection) {
        this.$emit('update:tagsSortingDirection', localSortingDirection)
      }
    }
  }
}
</script>
