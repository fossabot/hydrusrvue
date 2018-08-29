module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss']
    },
    entry: (process.env.BUILD_FOR_ELECTRON === 'true')
      ? { app: './src/main-electron.js' }
      : { app: './src/main.js' }
  }
}
