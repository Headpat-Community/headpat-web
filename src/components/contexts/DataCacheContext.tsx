"use client"
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useRef,
} from "react"
import {
  deleteFromDb,
  getAllFromDb,
  getFromDb,
  openDb,
  saveToDb,
} from "@/lib/indexeddb-utils"

const DB_NAME = "HeadpatCache"
const DB_VERSION = 4 // Increment this when changing the schema
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours

const STORE_NAMES = [
  "users",
  "communities",
  "notifications",
  "messages",
] as const

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
  children,
}) => {
  const [db, setDb] = React.useState<IDBDatabase | null>(null)
  const [cacheData, setCacheData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  // Use ref to prevent unnecessary re-renders when updating cache data
  const cacheDataRef = useRef(cacheData)
  cacheDataRef.current = cacheData

  // Memoize store names to prevent recreation
  const storeNamesArray = useMemo(() => [...STORE_NAMES], [])

  // Memoized database initialization to prevent unnecessary re-runs
  const initDb = useCallback(async () => {
    try {
      const database = await openDb(DB_NAME, DB_VERSION, storeNamesArray)
      setDb(database)

      const allCacheData: Record<string, any> = {}

      // Process all stores in parallel for better performance
      const storePromises = storeNamesArray.map(async (storeName) => {
        const storeData = await getAllFromDb<CacheItem<any>>(
          database,
          storeName
        )
        return storeData.map((item) => ({
          key: `${storeName}-${item.id}`,
          item,
        }))
      })

      const allStoreResults = await Promise.all(storePromises)

      // Combine all results efficiently
      allStoreResults.flat().forEach(({ key, item }) => {
        allCacheData[key] = item
      })

      setCacheData(allCacheData)
      setLoading(false)
    } catch (error) {
      console.error("Failed to initialize database:", error)
      setLoading(false)
    }
  }, [storeNamesArray])

  React.useEffect(() => {
    initDb()
  }, [initDb])

  // Memoized wait function to prevent recreation
  const waitForDb = useCallback(async () => {
    if (!loading) return

    // Avoid unbounded busy-wait: race loading flag with a timeout
    let attempts = 0
    const maxAttempts = 200 // max ~10s wait

    while (loading && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      attempts += 1
    }

    if (attempts >= maxAttempts) {
      console.warn("Database initialization timeout")
    }
  }, [loading])

  // Memoized cache key generator to prevent string concatenation on every call
  const getCacheKey = useCallback(
    (storeName: string, key: string) => `${storeName}-${key}`,
    []
  )

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
        const cacheKey = getCacheKey(storeName, key)
        setCacheData((prev) => ({
          ...prev,
          [cacheKey]: cachedData,
        }))
        return cachedData
      }

      // Clean up expired cache
      if (cachedData) {
        await deleteFromDb(db, storeName, key)
      }
      return null
    },
    [db, waitForDb, getCacheKey]
  )

  const saveAllCache = useCallback(
    async <T,>(storeName: string, data: T[]) => {
      await waitForDb()
      if (!db) return

      const currentTime = Date.now()

      // Create cache items efficiently
      const cacheItems = data.map((item) => ({
        id: (item as any)["$id"],
        data: item,
        timestamp: currentTime,
      }))

      // Save to database in parallel for better performance
      const savePromises = cacheItems.map(async (cacheItem) => {
        if (cacheItem.id) {
          await saveToDb(db, storeName, cacheItem)
        }
      })

      await Promise.all(savePromises)

      // Update local cache efficiently
      const newCacheData = cacheItems.reduce(
        (acc, item) => {
          if (item.id) {
            acc[getCacheKey(storeName, item.id)] = item
          }
          return acc
        },
        {} as Record<string, any>
      )

      setCacheData((prev) => ({ ...prev, ...newCacheData }))
    },
    [db, waitForDb, getCacheKey]
  )

  const saveCache = useCallback(
    async <T,>(storeName: string, key: string, data: T) => {
      await waitForDb()
      if (!db) return

      const currentTime = Date.now()
      const cacheItem = { id: key, data, timestamp: currentTime }

      await saveToDb(db, storeName, cacheItem)

      const cacheKey = getCacheKey(storeName, key)
      setCacheData((prev) => ({
        ...prev,
        [cacheKey]: cacheItem,
      }))
    },
    [db, waitForDb, getCacheKey]
  )

  const removeCache = useCallback(
    async (storeName: string, key: string) => {
      await waitForDb()
      if (!db) return

      await deleteFromDb(db, storeName, key)

      const cacheKey = getCacheKey(storeName, key)
      setCacheData((prev) => {
        const newData = { ...prev }
        delete newData[cacheKey]
        return newData
      })
    },
    [db, waitForDb, getCacheKey]
  )

  const getCacheSync = useCallback(
    <T,>(storeName: string, key: string): CacheItem<T> | null => {
      const cacheKey = getCacheKey(storeName, key)
      return cacheDataRef.current[cacheKey] || null
    },
    [getCacheKey]
  )

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      getCache,
      saveCache,
      removeCache,
      getCacheSync,
      getAllCache,
      saveAllCache,
    }),
    [getCache, saveCache, removeCache, getCacheSync, getAllCache, saveAllCache]
  )

  return (
    <DataCacheContext.Provider value={contextValue}>
      {loading ? null : children}
    </DataCacheContext.Provider>
  )
}

export const useDataCache = () => {
  const context = useContext(DataCacheContext)
  if (!context) {
    throw new Error("useDataCache must be used within a DataCacheProvider")
  }
  return context
}
