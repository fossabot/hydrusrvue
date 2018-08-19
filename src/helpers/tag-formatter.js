import config from '@/config'

export default {
  getColor (tag, colors) {
    if (!colors.length) {
      return config.fallbackTagColor
    }

    if (!tag.includes(':')) {
      return colors.find(color => color.name === 'unnamespaced').color
    }

    const available = colors.find(
      color => color.name === tag.split(':')[0]
    )

    return available
      ? available.color
      : colors.find(color => color.name === 'unnamespaced').color
  },
  formatForApp (tag) {
    return tag.trim().split('_').join('\\ ').split(' ').join('_')
  },
  formatForApi (tag) {
    return tag.trim().split('_').join(' ').split('\\ ').join('_')
  }
}
