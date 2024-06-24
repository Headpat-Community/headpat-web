import { createSessionServerClient } from '@/app/appwrite-session'
import { UserData } from '@/utils/types/models'
import { Query } from 'node-appwrite'

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserDataFromProfileUrl(
  profileUrl: string
): Promise<UserData.UserDataType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'userdata', [Query.equal('profileUrl', profileUrl)])
    .catch((error) => {
      return error
    })
}

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserData(): Promise<UserData.UserDataDocumentsType> {
  const { account, databases } = await createSessionServerClient()
  const accountData = await account.get().catch((error) => {
    return error
  })
  const data: UserData.UserDataDocumentsType = await databases
    .getDocument('hp_db', 'userdata', `${accountData.$id}`)
    .catch((error) => {
      return error
    })
  return data
}
