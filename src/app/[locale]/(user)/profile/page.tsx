import { redirect } from '@/i18n/routing'
import { getUserData } from '@/utils/server-api/user/getUserData'

export const runtime = 'edge'

export default async function Profile(props) {
  const params = await props.params

  const { locale } = params

  try {
    const user = await getUserData()

    return redirect({
      // @ts-ignore
      href: `/user/${user.profileUrl}`,
      locale,
    })
  } catch (error) {
    return redirect({ href: '/login', locale })
  }
}
