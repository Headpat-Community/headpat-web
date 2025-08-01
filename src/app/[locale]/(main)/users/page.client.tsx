'use client'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { databases, Query } from '@/app/appwrite-client'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import UserCard from '@/components/user/userCard'
import { UserDataDocumentsType, UserDataType } from '@/utils/types/models'
import { useTranslations } from 'gt-next/client'

export default function ClientPage() {
  const t = useTranslations('UsersPage')
  const {
    data: users,
    isLoading,
    isError
  } = useQuery<UserDataDocumentsType[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response: UserDataType = await databases.listDocuments(
          'hp_db',
          'userdata',
          [Query.orderDesc('$createdAt'), Query.limit(250), Query.offset(0)]
        )
        return response.documents
      } catch {
        toast.error('Failed to fetch users. Please try again later.')
        return []
      }
    },
    staleTime: 300 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  if (isLoading) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>{t('loading')}</h1>
        </div>
      </div>
    )
  }

  if (isError || !users || users.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>{t('noUsers')}</h1>
          <p className={'text-muted-foreground'}>{t('noUsersDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
      }
    >
      {users.map((user) => {
        return (
          <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
            <UserCard user={user} isChild>
              <div className={'h-full w-full'}>
                {user.avatarId ? (
                  <Image
                    src={
                      getAvatarImageUrlPreview(
                        user.avatarId,
                        'width=250&height=250'
                      ) || null
                    }
                    alt={user.displayName}
                    className="object-cover rounded-md"
                    width={250}
                    height={250}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center text-wrap truncate">
                    <p className="px-2 text-gray-400 text-center truncate">
                      {user.displayName}
                    </p>
                  </div>
                )}
              </div>
            </UserCard>
          </Card>
        )
      })}
    </div>
  )
}
