import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getBooks: () => ipcRenderer.invoke('getBooks'),
  addBook: (book) => ipcRenderer.invoke('addBook', book),
  deleteBook: (id) => ipcRenderer.invoke('deleteBook', id),
  updateBook: (book) => ipcRenderer.invoke('updateBook', book)
})
