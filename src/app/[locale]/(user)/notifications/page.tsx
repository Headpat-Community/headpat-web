import PageLayout from '@/components/pageLayout'
import { ChevronRight, MegaphoneIcon } from 'lucide-react'
import { getUserNotifications } from '@/utils/server-api/notifications/getUserNotifications'
import { getUserDataSingle } from '@/utils/server-api/user/getUserData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'

export default async function Page() {
  const notifications = await getUserNotifications()
  return (
    <PageLayout title={'Notifications'}>
      <ul
        role="list"
        className="mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
      >
        {notifications &&
          notifications.documents.map(async (notification) => {
            if (notification.type === 'newFollower') {
              const user = await getUserDataSingle(notification.userId)

              return (
                <li
                  key={notification.$id}
                  className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 dark:hover:bg-gray-50/10 sm:px-6"
                >
                  <div className="flex min-w-0 gap-x-4">
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
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6">
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        New Follower!
                      </p>
                      <p className="mt-1 flex text-xs leading-5 text-gray-400 dark:text-gray-300">
                        {user.displayName} followed you! 🎉
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-4">
                    <ChevronRight
                      className="h-5 w-5 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </li>
              )
            }
          })}
      </ul>
    </PageLayout>
  )
}
