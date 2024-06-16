import { cookies } from 'next/headers'
import SidebarResizable from '@/components/header/header-resizable'
import MobileNav from '@/components/header/mobile-nav'
import { createSessionServerClient } from '@/app/appwrite-session'

export default async function HeaderServer({ children, lang }) {
  const layout = cookies().get('react-resizable-panels:layout')
  const collapsed = cookies().get('react-resizable-panels:collapsed')

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  const navCollapsedSize = 4

  const { account } = await createSessionServerClient()

  const accountData = await account.get().catch((error) => {
    return
  })

  return (
    <>
      <div className={'min-h-full'}>
        <div className="md:hidden">
          <MobileNav lang={lang} accountData={accountData || null}>
            {children}
          </MobileNav>
        </div>
        <div className="hidden flex-col md:flex">
          <SidebarResizable
            lang={lang}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={navCollapsedSize}
            accountData={accountData || null}
          >
            {children}
          </SidebarResizable>
        </div>
      </div>
    </>
  )
}
