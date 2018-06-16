<template>
  <div class="frame">

    <ul class="file-detail-meta">
      <li><strong>ID:</strong> {{ file.id }}</li>
      <li><strong>Type:</strong> {{ type }}</li>
      <li><strong>MIME:</strong> {{ file.mime }}</li>
      <li><strong>Width:</strong> {{ file.width }} px</li>
      <li><strong>Height:</strong> {{ file.height }} px</li>
      <li><strong>Size:</strong> {{ file.size | formatFileSize }}</li>
    </ul>

    <ul class="file-detail-tags" v-if="tags.length">
      <li v-for="tag in tags" :key="tag.name">
        <router-link
          :to="{ path: tag.path, query: tag.query }"
          :style="{ color: tag.color }">
          {{ tag.name }}
        </router-link>
        <small class="file-amount">{{ tag.files }}</small>
      </li>
    </ul>

    <div class="file-detail-actions">
      <p>
        <a
          class="button is-primary"
          :href="file.mediaUrl + mediaToken"
          target="_blank"
          :download="`${file.id}.${file.mime.split('/')[1]}`">
          Download
        </a>
      </p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
    file: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    mediaToken: {
      type: String,
      required: true
    }
  },
  filters: {
    formatFileSize: function (bytes) {
      if (!bytes) {
        return ''
      }

      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))

      return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ` ${sizes[i]}`
    }
  }
}
</script>
