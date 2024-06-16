import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/server-api/user/getUserData'

export const runtime = 'edge'

export default async function Profile({ params: { lang } }) {
  const user = await getUserData()
  return redirect(`/${lang}/user/${user.profileUrl}`)
}
