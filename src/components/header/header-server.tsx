import { cookies } from 'next/headers'
import SidebarResizable from '@/components/header/header-resizable'
import MobileNav from '@/components/header/mobile-nav'
import { getUserDataSingle } from '@/utils/server-api/user/getUserData'
import { getUser } from '@/utils/server-api/account/user'

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

  const getAvatar = (id: string) => {
    if (!id) return

    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=250&height=250&quality=50`
  }

  let accountData = null
  let userData = null
  let userImage = null
  try {
    accountData = await getUser()
    userData = await getUserDataSingle(accountData.$id)
    userImage = getAvatar(userData.avatarId)
  } catch (error) {
    // do nothing
  }

  return (
    <>
      <div className={'min-h-full'}>
        <div className="md:hidden">
          <MobileNav
            accountData={accountData || null}
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
