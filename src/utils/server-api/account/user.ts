import { createSessionServerClient } from '@/app/appwrite-session'
import { UserAccountType } from '@/utils/types/account'
import { Models } from 'node-appwrite'

/**
 * This function is used to get the user.
 * @example
 * const userData = await getUser()
 */
export async function getUser(): Promise<UserAccountType> {
  const { account } = await createSessionServerClient()
  const data: UserAccountType = await account.get().catch((error) => {
    return error
  })
  return data
}

/**
 * This function is used to get the user mfa list.
 * @example
 * const userData = await getUser()
 */
export async function getMfaList(): Promise<Models.MfaFactors> {
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return error
  })
}

/**
 * This function is used to get the user mfa list.
 * @example
 * const userData = await getUser()
 */
export async function getTeams(): Promise<Models.TeamList<Models.Preferences>> {
  const { teams } = await createSessionServerClient()
  return await teams.list().catch((error) => {
    return error
  })
}
