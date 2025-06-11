import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import * as bookService from './bookService.js'
import { createDB } from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile(path.join(__dirname, 'dist', 'index.html'))
}

app.whenReady().then(async () => {
  await createDB()  // initialize the DB before anything else

  createWindow()

  ipcMain.handle('getBooks', async () => {
    return await bookService.getBooks()
  })

  ipcMain.handle('addBook', async (event, book) => {
    await bookService.addBook(book)
    return true
  })

  ipcMain.handle('deleteBook', async (event, id) => {
    await bookService.deleteBook(id)
    return true
  })

  ipcMain.handle('updateBook', async (event, updatedBook) => {
    await bookService.updateBook(updatedBook)
    return true
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// To make it into an exe: nmp run dist and nmp run build to build it