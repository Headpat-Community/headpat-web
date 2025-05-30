'use server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Models } from 'node-appwrite'
import { AccountPrefs } from '@/utils/types/models'

/**
 * This function is used to get the user.
 * @example
 * const userData = await getUser()
 */
export async function getUser(): Promise<AccountPrefs> {
  const { account } = await createSessionServerClient()
  return await account.get().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}

/**
 * This function is used to get the user mfa list.
 * @example
 * const userData = await getUser()
 */
export async function getMfaList(): Promise<Models.MfaFactors> {
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}

/**
 * This function is used to get the user mfa factors.
 * @example
 * const mfaFactors = await getMfaFactors()
 */
export async function getMfaFactors(): Promise<Models.MfaFactors> {
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}
