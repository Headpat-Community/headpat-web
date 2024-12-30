'use server'

import { createAdminClient } from '@/app/appwrite-session'
import { headers } from 'next/headers'
import { OAuthProvider } from 'node-appwrite'
import { redirect } from '@/i18n/routing'

export async function signInWithGithub(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithGoogle(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )
  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithDiscord(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Discord,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithSpotify(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Spotify,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithTwitch(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Twitch,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithMicrosoft(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Microsoft,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithApple(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Apple,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}

export async function signInWithEurofurence(locale: string) {
  const { account } = await createAdminClient()

  const origin = (await headers()).get('origin')

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Oidc,
    `${origin}/api/user/oauth`,
    `${origin}/login?failure=true`
  )

  // @ts-ignore
  return redirect({ href: redirectUrl, locale })
}
