import { getUser } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export default async function Layout({ children }) {
  try {
    await getUser()
    return children
  } catch (error) {
    if (error.type === 'general_unauthorized_scope') {
      redirect('/login')
    } else {
      redirect('/login/mfa')
    }
  }
}
