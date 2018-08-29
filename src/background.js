import * as path from 'path'
import { format as formatUrl } from 'url'

import { app, protocol, BrowserWindow, Menu } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

if (isDevelopment) {
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH)
}

let mainWindow

protocol.registerStandardSchemes(['app'], { secure: true })

function createMainWindow () {
  const window = new BrowserWindow({
    width: 1280,
    height: 800
  })

  if (isDevelopment) {
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    if (!process.env.IS_TEST) {
      window.webContents.openDevTools()
    }
  } else {
    createProtocol('app')

    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()

    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

function createMenu () {
  const application = {
    label: 'application',
    submenu: [
      {
        label: 'about',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: 'edit',
    submenu: [
      {
        label: 'undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:'
      },
      {
        label: 'redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      },
      {
        label: 'select all',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    await installVueDevtools()
  }

  mainWindow = createMainWindow()

  createMenu()
})
