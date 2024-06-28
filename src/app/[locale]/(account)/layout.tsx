import { getUser } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export default async function Layout({ children }) {
  const accountData = await getUser()
  if (accountData.code === 401) {
    redirect('/login')
  } else {
    return children
  }
}
