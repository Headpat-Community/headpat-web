import { Suspense } from 'react'
import Loading from '../../../loading'
import { getMfaList, getUser } from '@/utils/server-api/account/user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralAccountView from '@/components/account/views/general'
import FrontpageView from '@/components/account/views/frontpage'
import SocialsView from '@/components/account/views/socials'
import { getDict } from 'gt-next/server'

export async function generateMetadata({ params }) {
  const paramsResponse = await params
  const meta = await getDict('AccountMetadata')

  return {
    title: 'Account Settings',
    description: meta('description'),
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: paramsResponse.locale,
      type: 'website',
    },
  }
}

export default async function AccountSettings() {
  const mfaList = await getMfaList()
  const accountData = await getUser()
  const translations = await getDict('Account')

  return (
    <Suspense fallback={<Loading />}>
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col items-center justify-center">
          <TabsList className="grid w-full sm:max-w-4xl grid-cols-3">
            <TabsTrigger value="general">{translations('general')}</TabsTrigger>
            <TabsTrigger value="frontpage">
              {translations('frontpage')}
            </TabsTrigger>
            <TabsTrigger value="socials">{translations('socials')}</TabsTrigger>
          </TabsList>
        </div>

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
  )
}
