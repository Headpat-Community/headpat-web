'use client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createIDBPersister } from '@/lib/reactQueryIndexedDbPersister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

const persister = createIDBPersister('tanstack-query')

export const TanQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }} // 24 hours
  >
    {children}
  </PersistQueryClientProvider>
)
