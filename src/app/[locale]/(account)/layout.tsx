import { redirect } from 'next/link'
import { createSessionServerClient } from '@/app/appwrite-session'

export default async function Layout(props) {
  const params = await props.params

  const { locale } = params

  const { account } = await createSessionServerClient()
  try {
    await account.get()
    return props.children
  } catch (error) {
    if (error.type === 'general_unauthorized_scope') {
      redirect({ href: '/login', locale })
    } else {
      redirect({ href: '/login/mfa', locale })
    }
  }
}
