import { Suspense } from 'react'
import Loading from '../../../loading'
import { getMfaList, getUser } from '@/utils/server-api/account/user'
import { getUserData } from '@/utils/server-api/user/getUserData'
import PageLayout from '@/components/pageLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralAccountView from '@/components/account/views/general'
import FrontpageView from '@/components/account/views/frontpage'
import SocialsView from '@/components/account/views/socials'

export const metadata = {
  title: 'Account Settings',
}

export const runtime = 'edge'

export default async function AccountSettings({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const mfaList = await getMfaList()
  const accountData = await getUser()
  const userData = await getUserData()

  return (
    <PageLayout title="Account Settings">
      <Suspense fallback={<Loading />}>
        <Tabs defaultValue="general" className="">
          <TabsList className={'mb-2'}>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="frontpage">Frontpage</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralAccountView
              accountData={accountData}
              mfaList={mfaList}
              userData={userData}
            />
          </TabsContent>
          <TabsContent value="frontpage">
            <FrontpageView
              accountData={accountData}
              userDataResponse={userData}
            />
          </TabsContent>
          <TabsContent value="socials">
            <SocialsView userDataResponse={userData} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </PageLayout>
  )
}
