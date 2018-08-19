<template>
  <div class="settings-colors settings-block">

    <div class="table-container">

      <table class="table is-fullwidth is-striped is-hoverable">

        <thead>
          <tr>
            <th>namespace</th>
            <th>color</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="namespace in localColors"
            :key="namespace.name">
            <td
              :style="{ color: namespace.color }">
              {{ namespace.name }}
            </td>
            <td>
              <color-picker v-model="namespace.color" />
            </td>
          </tr>
        </tbody>

      </table>

    </div>

  </div>
</template>

<script>
import { VueColorpicker } from 'vue-pop-colorpicker/src'

export default {
  name: 'Colors',
  props: {
    colors: {
      type: Array,
      required: true
    }
  },
  computed: {
    localColors: {
      get: function () {
        return this.colors
      },
      set: function (localColors) {
        this.$emit('update:colors', localColors)
      }
    }
  },
  components: {
    'color-picker': VueColorpicker
  }
}
</script>
