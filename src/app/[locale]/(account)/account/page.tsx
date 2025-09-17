import FrontpageView from "@/components/account/views/frontpage"
import GeneralAccountView from "@/components/account/views/general"
import SocialsView from "@/components/account/views/socials"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMfaList, getUser } from "@/utils/server-api/account/user"
import { getTranslations } from "gt-next/server"
import { Suspense } from "react"
import Loading from "../../../loading"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const paramsResponse = await params
  const meta = await getTranslations("AccountMetadata")

  return {
    title: "Account Settings",
    description: meta("description"),
    openGraph: {
      title: meta("title"),
      description: meta("description"),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: paramsResponse.locale,
      type: "website",
    },
  }
}

export default async function AccountSettings() {
  const mfaList = await getMfaList()
  const accountData = await getUser()
  const translations = await getTranslations("Account")

  return (
    <Suspense fallback={<Loading />}>
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col items-center justify-center">
          <TabsList className="grid w-full grid-cols-3 sm:max-w-4xl">
            <TabsTrigger value="general">{translations("general")}</TabsTrigger>
            <TabsTrigger value="frontpage">
              {translations("frontpage")}
            </TabsTrigger>
            <TabsTrigger value="socials">{translations("socials")}</TabsTrigger>
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
