'use server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Models } from 'node-appwrite'
import { Account } from '@/utils/types/models'
import { NextResponse } from 'next/server'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the user.
 * @example
 * const userData = await getUser()
 */
export async function getUser(): Promise<Account.AccountPrefs> {
  unstable_noStore()
  const { account } = await createSessionServerClient()
  return await account.get()
}

/**
 * This function is used to get the user mfa list.
 * @example
 * const userData = await getUser()
 */
export async function getMfaList(): Promise<Models.MfaFactors> {
  unstable_noStore()
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}

/**
 * This function is used to get the user mfa list.
 * @example
 * const userData = await getUser()
 */
export async function getTeams(): Promise<Models.TeamList<Models.Preferences>> {
  unstable_noStore()
  const { teams } = await createSessionServerClient()
  return await teams.list().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}

/**
 * This function is used to check if the user has mfa enabled and if needed to start the mfa challenge.
 * @example
 * const mfaChallengeNeeded = await mfaChallengeNeeded()
 */
export async function mfaChallengeNeeded() {
  const { account } = await createSessionServerClient()
  try {
    return await account.get()
  } catch (error) {
    console.log(error)
    if (error.type === `user_more_factors_required`) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/login/mfa`
      )
    } else {
      console.log('second error')
      return JSON.parse(JSON.stringify(error))
    }
  }
}

/**
 * This function is used to get the user mfa factors.
 * @example
 * const mfaFactors = await getMfaFactors()
 */
export async function getMfaFactors(): Promise<Models.MfaFactors> {
  unstable_noStore()
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}
