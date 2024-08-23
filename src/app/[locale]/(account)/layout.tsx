import { getUser } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export default async function Layout({ children }) {
  try {
    await getUser()
    return children
  } catch (error) {
    redirect('/login')
  }
}
