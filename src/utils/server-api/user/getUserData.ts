import { createSessionServerClient } from '@/app/appwrite-session'
import { UserDataType, UserProfileDocumentsType } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { getUser } from '@/utils/server-api/account/user'

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserDataFromProfileUrl(
  profileUrl: string
): Promise<UserDataType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'userdata', [Query.equal('profileUrl', profileUrl)])
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserData(): Promise<UserProfileDocumentsType> {
  const { databases } = await createSessionServerClient()
  const accountData = await getUser()
  return await databases
    .getDocument('hp_db', 'userdata', `${accountData.$id}`)
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
