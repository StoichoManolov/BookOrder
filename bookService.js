import { getDB } from './database.js'

// Get all books
export async function getBooks() {
  const db = getDB()
  await db.read()
  return db.data.books
}

// Add new book
export async function addBook(book) {
  const db = getDB()
  await db.read()
  db.data.books.push(book)
  await db.write()
}

// Delete book
export async function deleteBook(id) {
  const db = getDB()
  await db.read()
  db.data.books = db.data.books.filter(b => b.id !== id)
  await db.write()
}

// Update book
export async function updateBook(updatedBook) {
  const db = getDB()
  await db.read()
  db.data.books = db.data.books.map(b => b.id === updatedBook.id ? updatedBook : b)
  await db.write()
}
