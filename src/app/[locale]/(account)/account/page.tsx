import { Suspense } from 'react'
import Loading from '../../../loading'
import { getMfaList, getUser } from '@/utils/server-api/account/user'
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
            <GeneralAccountView accountData={accountData} mfaList={mfaList} />
          </TabsContent>
          <TabsContent value="frontpage">
            <FrontpageView accountData={accountData} />
          </TabsContent>
          <TabsContent value="socials">
            <SocialsView accountData={accountData} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </PageLayout>
  )
}
