import PageLayout from '@/components/pageLayout'
import { getUserNotifications } from '@/utils/server-api/notifications/getUserNotifications'
import { getUserDataSingle } from '@/utils/server-api/user/getUserData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { formatDate } from '@/components/calculateTimeLeft'
import UserCard from '@/components/user/userCard'
import { Link } from '@/navigation'

export const runtime = 'edge'

export default async function Page() {
  const notifications = await getUserNotifications()

  if (notifications.documents.length === 0) {
    return (
      <PageLayout title={'Notifications'}>
        <div className="mx-auto mb-4 mt-8 max-w-7xl">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7">Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              You have no notifications yet.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={'Notifications'}>
      <ul
        role="list"
        className="mx-8 lg:mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
      >
        {notifications &&
          notifications.documents
            .sort(
              (a, b) =>
                new Date(b.$createdAt).getTime() -
                new Date(a.$createdAt).getTime()
            )
            .map(async (notification) => {
              if (notification.type === 'newFollower') {
                const user = await getUserDataSingle(notification.message)

                return (
                  <li
                    key={notification.$id}
                    className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 dark:hover:bg-gray-50/10 sm:px-6"
                  >
                    <div className="flex min-w-0 gap-x-4 items-center">
                      <UserCard user={user} isChild={false}>
                        <Link
                          href={{
                            pathname: '/user/[profileUrl]',
                            params: { profileUrl: user.profileUrl },
                          }}
                        >
                          <Avatar>
                            <AvatarImage
                              src={
                                getAvatarImageUrlPreview(
                                  user.avatarId,
                                  'width=250&height=250'
                                ) || null
                              }
                            />
                            <AvatarFallback>
                              {user.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      </UserCard>
                      <div className="min-w-0 flex-auto">
                        <p className="mt-1 flex leading-5 text-gray-400 dark:text-gray-300">
                          <UserCard user={user} isChild={false}>
                            <Link
                              href={{
                                pathname: '/user/[profileUrl]',
                                params: { profileUrl: user.profileUrl },
                              }}
                              className={'font-bold'}
                            >
                              {user.displayName}
                            </Link>
                            &nbsp;
                          </UserCard>{' '}
                          followed you! 🎉
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-4">
                      {formatDate(new Date(notification.$createdAt))}
                    </div>
                  </li>
                )
              }
            })}
      </ul>
    </PageLayout>
  )
}
