import { createSessionServerClient } from '@/app/appwrite-session'
import type { UserAccountType, UserDataType } from '@/utils/types'

export async function getAccount() {
  const { account } = await createSessionServerClient()
  const accountData: UserAccountType = await account.get().catch((error) => {
    return error
  })
  return accountData
}

export async function getUserData() {
  const { databases } = await createSessionServerClient()
  const userDataResponse: UserDataType = await databases
    .listDocuments('hp_db', 'userdata')
    .catch((error) => {
      return error
    })
  return userDataResponse.documents[0]
}
