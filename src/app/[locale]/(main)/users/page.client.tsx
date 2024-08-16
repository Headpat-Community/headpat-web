'use client'

import { UserData } from '@/utils/types/models'
import { Card } from '@/components/ui/card'
import UserCard from '@/components/user/userCard'
import { Link } from '@/navigation'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { useEffect, useState } from 'react'
import { listDocuments } from '@/components/api/documents'
import { Query } from '@/app/appwrite-client'

export default function PageClient() {
  const [users, setUsers] = useState<UserData.UserDataType>(null)

  useEffect(() => {
    listDocuments('hp_db', 'userdata', [Query.limit(200)]).then(
      (data: UserData.UserDataType) => setUsers(data)
    )
  }, [])

  if (!users) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div
      className={
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
      }
    >
      {users.documents.map((user: UserData.UserDataDocumentsType) => {
        return (
          <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
            <UserCard user={user} isChild={true}>
              <div className={'h-full w-full'}>
                <Link
                  href={{
                    pathname: '/user/[profileUrl]',
                    params: { profileUrl: user.profileUrl },
                  }}
                >
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
                      width={1000}
                      height={1000}
                      draggable={false}
                      loading="lazy"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center">
                      <p className="text-gray-400 text-center font-mono truncate px-2">
                        {user.displayName}
                      </p>
                    </div>
                  )}
                </Link>
              </div>
            </UserCard>
          </Card>
        )
      })}
    </div>
  )
}
