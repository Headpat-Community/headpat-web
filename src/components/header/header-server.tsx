import { cookies } from 'next/headers'
import SidebarResizable from '@/components/header/header-resizable'
import MobileNav from '@/components/header/mobile-nav'
import { createSessionServerClient } from '@/app/appwrite-session'

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

  const { account } = await createSessionServerClient()

  const accountData = await account.get().catch(() => {
    return
  })

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
            translations={translations}
          >
            {children}
          </SidebarResizable>
        </div>
      </div>
    </>
  )
}
