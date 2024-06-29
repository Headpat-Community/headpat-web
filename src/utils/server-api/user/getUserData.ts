import { createSessionServerClient } from '@/app/appwrite-session'
import { UserData } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { getUser } from '@/utils/server-api/account/user'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserDataFromProfileUrl(
  profileUrl: string
): Promise<UserData.UserDataType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'userdata', [Query.equal('profileUrl', profileUrl)])
    .catch((error) => {
      return error
    })
}

/**
 * This function is used to get the user data from the user id.
 * @example
 * const userData = await getUserDataSingle('userId')
 */
export async function getUserDataSingle(
  userId: string
): Promise<UserData.UserDataDocumentsType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .getDocument('hp_db', 'userdata', `${userId}`)
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
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  const accountData = await getUser()
  return await databases
    .getDocument('hp_db', 'userdata', `${accountData.$id}`)
    .catch((error) => {
      return error
    })
}

/**
 * This function is used to get the user data of all users.
 * @example
 * const userData = await getUserDataList()
 */
export async function getUserDataList(): Promise<UserData.UserDataType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases.listDocuments('hp_db', 'userdata').catch((error) => {
    return error
  })
}
