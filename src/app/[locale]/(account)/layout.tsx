import { redirect } from '@/navigation'
import { createSessionServerClient } from '@/app/appwrite-session'

export default async function Layout({ children }) {
  const { account } = await createSessionServerClient()
  try {
    await account.get()
    return children
  } catch (error) {
    if (error.type === 'general_unauthorized_scope') {
      redirect('/login')
    } else {
      redirect('/login/mfa')
    }
  }
}
