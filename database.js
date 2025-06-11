import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

let db

export async function createDB() {
  const userDataPath = app.getPath('userData')
  const dbDir = path.join(userDataPath, 'data')
  const dbFile = path.join(dbDir, 'db.json')

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const adapter = new JSONFile(dbFile)
  db = new Low(adapter, { books: [] })

  await db.read()

  if (!db.data) {
    db.data = { books: [] }
    await db.write()
  }

  return db
}

// Helper to get the initialized db later
export function getDB() {
  if (!db) throw new Error('Database not initialized yet!')
  return db
}
