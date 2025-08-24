import { get, set, del, createStore } from "idb-keyval"
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client"

export function createIDBPersister(
  idbValidKey: IDBValidKey = "tanstack-query",
  dbName = "HeadpatPlaceQuery",
  storeName = "tan-query"
): Persister {
  const customStore = createStore(dbName, storeName)
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client, customStore)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey, customStore)
    },
    removeClient: async () => {
      await del(idbValidKey, customStore)
    },
  }
}
