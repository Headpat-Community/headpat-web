'use server'

import { createAdminClient } from '@/app/appwrite-session'
import { headers } from 'next/headers'
import { OAuthProvider } from 'node-appwrite'
import { redirect } from 'next/navigation'

export async function signInWithProvider(provider: OAuthProvider) {
  const { account } = await createAdminClient()
  const origin = (await headers()).get('origin')
  const redirectUrl = await account.createOAuth2Token(
    provider,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )
  return redirect(redirectUrl)
}
