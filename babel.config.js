module.exports = {
  presets: [
    (process.env.BUILD_FOR_ELECTRON === 'true')
      ? ['@vue/app', { useBuiltIns: 'entry' }]
      : '@vue/app'
  ]
}
