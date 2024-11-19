export const openDb = async (
  dbName: string,
  version: number,
  storeNames: string[]
) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result

      // Dynamically create object stores if they don't exist
      storeNames.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' }) // 'id' is the keyPath for each store
        }
      })
    }

    request.onerror = () => reject(new Error('IndexedDB open failed'))
    request.onsuccess = (e: any) => resolve(e.target.result)
  })
}

export const getFromDb = async <T>(
  db: IDBDatabase,
  storeName: string,
  key: string
): Promise<T | null> => {
  return new Promise<T | null>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onerror = () => reject(new Error('IndexedDB read failed'))
    request.onsuccess = () => resolve(request.result ? request.result : null)
  })
}

export const getAllFromDb = async <T>(
  db: IDBDatabase,
  storeName: string
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export const saveToDb = async <T>(
  db: IDBDatabase,
  storeName: string,
  data: T
) => {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onerror = () => reject(new Error('IndexedDB save failed'))
    request.onsuccess = () => resolve()
  })
}

export const deleteFromDb = async (
  db: IDBDatabase,
  storeName: string,
  key: string
) => {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onerror = () => reject(new Error('IndexedDB delete failed'))
    request.onsuccess = () => resolve()
  })
}
