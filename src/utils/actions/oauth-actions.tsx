"use server"

import { createAdminClient } from "@/app/appwrite-session"
import { headers } from "next/headers"
import type { OAuthProvider } from "node-appwrite"
import { redirect } from "next/navigation"

export async function signInWithProvider(provider: OAuthProvider) {
  try {
    const { account } = await createAdminClient()
    const origin = (await headers()).get("origin")

    if (!origin) {
      throw new Error("Origin header not found")
    }

    const redirectUrl = await account.createOAuth2Token(
      provider,
      `${origin}/api/user/oauth`,
      `${origin}/login?failure=true`
    )

    return redirect(redirectUrl)
  } catch (error) {
    console.error("OAuth sign-in error:", error)
    // Fallback redirect to login page with error
    return redirect("/login?error=oauth_failed")
  }
}
