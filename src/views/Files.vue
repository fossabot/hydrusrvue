<template>
  <div class="wrapper">

    <vue-headful :title="title" />

    <section class="section">

      <search
        :isLoading="isLoading"
        :lastQuery="lastQuery"
        :wantsAdditionalFiles="wantsAdditionalFiles" />

      <hr>

      <div class="columns is-multiline is-mobile" v-if="files.length">

        <div
          class="
            column is-6-mobile
            is-3-tablet is-2-desktop
            is-one-eight-large-desktop
            is-one-tenth-huge-desktop
          "
          v-for="(file, index) in files"
          :key="index">
          <div class="file-preview">
            <div
              class="file-preview-image"
              :style="{
                backgroundImage: `url(${file.thumbnailUrl + mediaToken})`
              }"></div>
            <router-link :to="`/files/${file.id}`" class="file-preview-link">
              View file
            </router-link>
            <div class="file-preview-gallery-button">
              <span class="icon is-large">
                <font-awesome-icon icon="images" class="fa-2x" />
              </span>
              <img
                class="preview-img-item"
                :src="file.thumbnailUrl + mediaToken"
                @click="$photoswipe.open(index, galleryItems)">
            </div>
          </div>
        </div>

      </div>

      <p v-if="!isLoading && !files.length && !lastQuery">No search started.</p>

      <p v-if="!isLoading && !files.length && lastQuery">No files found.</p>

      <div class="has-text-centered" v-if="isLoading">
        <span class="icon is-large has-text-primary">
          <font-awesome-icon icon="spinner" class="fa-pulse fa-2x" />
        </span>
      </div>

    </section>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import throttle from 'lodash/throttle'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import config from '@/config'

import Search from '@/components/files/Search'

let scrollListener

export default {
  name: 'Files',
  data: function () {
    return {
      wantsAdditionalFiles: false,
      title: `files – ${config.title}`
    }
  },
  computed: {
    galleryItems: function () {
      const galleryItems = []

      for (const file of this.files) {
        if (this.isImage(file.mime)) {
          galleryItems.push({
            src: file.mediaUrl + this.mediaToken,
            w: file.width,
            h: file.height
          })

          continue
        }

        galleryItems.push({
          html: `
            <div class="gallery-mode-notice">
              <p>
                This file cannot be displayed in gallery mode.<br>
                Please go to the <a href="#/files/${file.id}">detail view</a>
                instead.
              </p>
            </div>
          `
        })
      }

      return galleryItems
    },
    ...mapState({
      files: state => state.files.items,
      isLoading: state => state.files.isLoading,
      lastQuery: state => state.files.lastQuery
    }),
    ...mapGetters({
      mediaToken: 'auth/mediaTokenQueryString'
    })
  },
  methods: {
    isImage: function (mime) {
      return ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(
        mime
      )
    },
    bottomIsVisible: function () {
      const scrollY = window.scrollY
      const isVisible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const isAtBottomOfPage = (isVisible + scrollY) >= pageHeight

      return isAtBottomOfPage || (pageHeight < isVisible)
    }
  },
  created: function () {
    scrollListener = throttle(() => {
      this.wantsAdditionalFiles = this.bottomIsVisible()
    }, 50)

    window.addEventListener('scroll', scrollListener)
  },
  beforeRouteLeave: function (to, from, next) {
    window.removeEventListener('scroll', scrollListener)

    if (document.querySelector('.pswp--open')) {
      this.$photoswipe.close()
    }

    next()
  },
  components: {
    FontAwesomeIcon,
    Search
  }
}
</script>
