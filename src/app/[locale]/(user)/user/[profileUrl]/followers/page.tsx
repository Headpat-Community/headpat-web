import { getUserDataFromProfileUrl } from '@/utils/server-api/user/getUserData'
import ClientPage from './page.client'

export const runtime = 'edge'

export default async function FollowerPage({
  params: { locale, profileUrl },
}: {
  params: { locale: string; profileUrl: string }
}) {
  const userData = await getUserDataFromProfileUrl(profileUrl)

  return <ClientPage userData={userData} />
}
