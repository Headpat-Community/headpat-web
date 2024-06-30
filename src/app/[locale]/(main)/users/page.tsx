import { Card } from '@/components/ui/card'
import PageLayout from '@/components/pageLayout'
import { UserData } from '@/utils/types/models'
import { getUserDataList } from '@/utils/server-api/user/getUserData'
import UserCard from '@/components/user/userCard'
import { Link } from '@/navigation'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'

export const runtime = 'edge'

export default async function Users({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const users = await getUserDataList()

  return (
    <PageLayout title={'Users'}>
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
    </PageLayout>
  )
}
