import Client from './page.client'
import { getUserSelf } from '../../../../../utils/actions/user-actions'

export const metadata = {
  title: 'Account',
}

export const runtime = 'edge'

export default async function AccountPage() {
  const userResponseData = await getUserSelf()
  const userId = userResponseData.$id

  return (
    <>
      <Client userId={userId} />
    </>
  )
}
