'use client'
import React, { createContext, useCallback, useContext, useState } from 'react'
import {
  deleteFromDb,
  getAllFromDb,
  getFromDb,
  openDb,
  saveToDb
} from '@/lib/indexeddb-utils'

const DB_NAME = 'HeadpatCache'
const DB_VERSION = 4 // Increment this when changing the schema
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours

const STORE_NAMES = ['users', 'communities', 'notifications', 'messages']

type DataCacheContextType = {
  getCache: <T>(storeName: string, key: string) => Promise<CacheItem<T> | null>
  saveCache: <T>(storeName: string, key: string, data: T) => void
  removeCache: (storeName: string, key: string) => void
  getCacheSync: <T>(storeName: string, key: string) => CacheItem<T> | null
  getAllCache: <T>(storeName: string) => Promise<CacheItem<T>[]>
  saveAllCache: <T>(storeName: string, data: T[]) => void
}

type CacheItem<T> = {
  id: string
  data: T
  timestamp: number
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(
  undefined
)

export const DataCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [db, setDb] = React.useState<IDBDatabase | null>(null)
  const [cacheData, setCacheData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const initDb = async <T,>() => {
      const database = await openDb(DB_NAME, DB_VERSION, STORE_NAMES)
      setDb(database)

      const allCacheData: Record<string, any> = {}
      for (const storeName of STORE_NAMES) {
        const storeData = await getAllFromDb<CacheItem<T>>(database, storeName)
        storeData.forEach((item) => {
          allCacheData[`${storeName}-${item.id}`] = item
        })
      }
      setCacheData(allCacheData)
      setLoading(false)
    }
    initDb().then()
  }, [])

  const waitForDb = useCallback(async () => {
    if (!loading) return
    // Avoid unbounded busy-wait: race loading flag with a timeout
    let attempts = 0
    while (loading && attempts < 200) {
      // max ~10s wait
      await new Promise((resolve) => setTimeout(resolve, 50))
      attempts += 1
    }
  }, [loading])

  const getAllCache = useCallback(
    async <T,>(storeName: string): Promise<CacheItem<T>[]> => {
      await waitForDb()
      if (!db) return []
      return await getAllFromDb<CacheItem<T>>(db, storeName)
    },
    [db, waitForDb]
  )

  const getCache = useCallback(
    async <T,>(
      storeName: string,
      key: string
    ): Promise<CacheItem<T> | null> => {
      await waitForDb()
      if (!db) return null
      const cachedData = await getFromDb<CacheItem<T>>(db, storeName, key)

      if (
        cachedData &&
        Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME
      ) {
        setCacheData((prev) => ({
          ...prev,
          [`${storeName}-${key}`]: cachedData
        }))
        return cachedData
      }
      await deleteFromDb(db, storeName, key)
      return null
    },
    [db, waitForDb]
  )

  const saveAllCache = useCallback(
    async <T,>(storeName: string, data: T[]) => {
      await waitForDb()
      if (!db) return

      const cache = data.reduce((acc, item) => {
        acc[item['$id']] = { data: item, timestamp: Date.now() }
        return acc
      }, {})

      await Promise.all(
        Object.entries(cache).map(async ([key, cacheItem]) => {
          if (typeof cacheItem === 'object' && cacheItem !== null) {
            await saveToDb(db, storeName, { id: key, ...cacheItem })
          }
        })
      )

      setCacheData((prev) => ({ ...prev, ...cache }))
    },
    [db, waitForDb]
  )

  const saveCache = useCallback(
    async <T,>(storeName: string, key: string, data: T) => {
      await waitForDb()
      if (!db) return

      const cacheItem = { data, timestamp: Date.now() }
      await saveToDb(db, storeName, { id: key, ...cacheItem })
      setCacheData((prev) => ({
        ...prev,
        [`${storeName}-${key}`]: cacheItem
      }))
    },
    [db, waitForDb]
  )

  const removeCache = useCallback(
    async (storeName: string, key: string) => {
      await waitForDb()
      if (!db) return
      await deleteFromDb(db, storeName, key)
      setCacheData((prev) => {
        const newData = { ...prev }
        delete newData[`${storeName}-${key}`]
        return newData
      })
    },
    [db, waitForDb]
  )

  const getCacheSync = useCallback(
    <T,>(storeName: string, key: string): CacheItem<T> | null => {
      return cacheData[`${storeName}-${key}`] || null
    },
    [cacheData]
  )

  return (
    <DataCacheContext.Provider
      value={{
        getCache,
        saveCache,
        removeCache,
        getCacheSync,
        getAllCache,
        saveAllCache
      }}
    >
      {loading ? null : children}
    </DataCacheContext.Provider>
  )
}

export const useDataCache = () => {
  const context = useContext(DataCacheContext)
  if (!context) {
    throw new Error('useDataCache must be used within a DataCacheProvider')
  }
  return context
}
