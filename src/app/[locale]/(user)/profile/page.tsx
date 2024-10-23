import { redirect } from '@/i18n/routing'
import { getUserData } from '@/utils/server-api/user/getUserData'

export const runtime = 'edge'

export default async function Profile(props) {
  const params = await props.params

  const { locale } = params

  const user = await getUserData()
  if (!user) {
    return redirect({ href: '/login', locale })
  }
  return redirect({
    // @ts-ignore
    href: `/user/${user.profileUrl}`,
    locale,
  })
}
