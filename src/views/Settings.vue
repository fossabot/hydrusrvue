<template>
  <div class="wrapper">

    <vue-headful :title="title" />

    <section class="section">

      <div class="container">

        <div class="columns is-centered">

          <div class="column is-10-tablet is-8-desktop">

            <div class="frame">

              <div class="content">

                <h1 class="has-text-primary">Settings</h1>

                <p>
                  These settings are saved locally in your browser – they are
                  not carried over to other browsers or devices.
                </p>

                <form @submit.prevent="saveSettings">

                  <p>
                    <strong class="has-text-primary">Image size</strong>
                  </p>

                  <image-size :restrictImageSize.sync="restrictImageSize" />

                  <p>
                    <strong class="has-text-primary">Tag colors</strong>
                  </p>

                  <colors :colors.sync="colors" />

                  <p>
                    <strong class="has-text-primary">
                      Default files sorting
                    </strong>
                  </p>

                  <files-sorting
                    :filesSorting.sync="filesSorting"
                    :filesSortingDirection.sync="filesSortingDirection"
                    :filesSortingNamespaces.sync="filesSortingNamespaces" />

                  <p>
                    <strong class="has-text-primary">
                      Default tags sorting
                    </strong>
                  </p>

                  <tags-sorting
                    :tagsSorting.sync="tagsSorting"
                    :tagsSortingDirection.sync="tagsSortingDirection" />

                  <div class="field">
                    <div class="control">
                      <button
                        type="submit"
                        class="button"
                        :class="{
                          'is-primary': !hasSaved,
                          'is-success': hasSaved
                        }">
                        <span class="icon" v-if="!hasSaved">
                          <font-awesome-icon icon="save" v-if="!hasSaved" />
                        </span>
                        <span class="icon" v-if="hasSaved">
                          <font-awesome-icon icon="check" v-if="hasSaved" />
                        </span>
                        <span v-if="!hasSaved">Save</span>
                        <span v-if="hasSaved">Saved</span>
                      </button>
                    </div>
                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import config from '@/config'

import ImageSize from '@/components/settings/ImageSize'
import Colors from '@/components/settings/Colors'
import FilesSorting from '@/components/settings/FilesSorting'
import TagsSorting from '@/components/settings/TagsSorting'

export default {
  name: 'Settings',
  data: function () {
    return {
      restrictImageSize: this.$store.state.settings.restrictImageSize,
      colors: Object.assign([], this.$store.getters['settings/currentColors']),
      filesSorting: this.$store.state.settings.filesSorting,
      filesSortingDirection: this.$store.state.settings.filesSortingDirection,
      filesSortingNamespaces: Object.assign(
        [], this.$store.state.settings.filesSortingNamespaces
      ),
      tagsSorting: this.$store.state.settings.tagsSorting,
      tagsSortingDirection: this.$store.state.settings.tagsSortingDirection,
      hasSaved: false,
      title: `settings – ${config.title}`
    }
  },
  methods: {
    saveSettings: function () {
      if (this.hasSaved) {
        return
      }

      this.storeSettings({
        restrictImageSize: this.restrictImageSize,
        colors: this.colors,
        filesSorting: this.filesSorting,
        filesSortingDirection: this.filesSortingDirection,
        filesSortingNamespaces: this.filesSortingNamespaces,
        tagsSorting: this.tagsSorting,
        tagsSortingDirection: this.tagsSortingDirection
      })

      this.hasSaved = true

      setTimeout(() => {
        this.hasSaved = false
      }, 2000)
    },
    ...mapActions({
      storeSettings: 'settings/save'
    })
  },
  components: {
    FontAwesomeIcon,
    ImageSize,
    Colors,
    FilesSorting,
    TagsSorting
  }
}
</script>
