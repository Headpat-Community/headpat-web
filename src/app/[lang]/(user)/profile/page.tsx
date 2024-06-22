import { getUserData } from '@/utils/server-api/user/getUserData'
import { redirect } from '@/navigation'

export const runtime = 'edge'

export default async function Profile({ params: { lang } }) {
  const user = await getUserData()
  if (!user) {
    return redirect('/login')
  }
  return redirect({
    pathname: '/user/[profileUrl]',
    params: { profileUrl: user.profileUrl },
  })
}
