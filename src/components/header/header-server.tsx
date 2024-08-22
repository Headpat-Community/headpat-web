import { cookies } from 'next/headers'
import SidebarResizable from '@/components/header/header-resizable'
import MobileNav from '@/components/header/mobile-nav'
import { getUserDataSingle } from '@/utils/server-api/user/getUserData'
import { getUser } from '@/utils/server-api/account/user'
import { storage } from '@/app/appwrite-server'

export const dynamic = 'force-dynamic'

export default async function HeaderServer({
  children,
  locale,
  ...translations
}) {
  const layout = cookies().get('react-resizable-panels:layout')
  const collapsed = cookies().get('react-resizable-panels:collapsed')

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  const navCollapsedSize = 4

  const accountData = await getUser()

  const getAvatar = (id: string) => {
    if (!id) return

    return `https://api.headpat.de/v1/storage/buckets/avatars/files/${id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=250&height=250&quality=50`
  }

  const userData = await getUserDataSingle(accountData.$id)
  const userImage = getAvatar(userData.avatarId)

  return (
    <>
      <div className={'min-h-full'}>
        <div className="md:hidden">
          <MobileNav
            accountData={accountData || null}
            userData={userData || null}
            userImage={userImage}
            translations={translations}
          >
            {children}
          </MobileNav>
        </div>
        <div className="hidden flex-col md:flex">
          <SidebarResizable
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={navCollapsedSize}
            accountData={accountData || null}
            userData={userData || null}
            userImage={userImage}
            translations={translations}
          >
            {children}
          </SidebarResizable>
        </div>
      </div>
    </>
  )
}
