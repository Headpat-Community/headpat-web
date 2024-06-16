import { createSessionServerClient } from '@/app/appwrite-session'

export async function getUserData() {
  const { account, databases } = await createSessionServerClient()
  const accountData = await account.get().catch((error) => {
    return error
  })
  return await databases
    .getDocument('hp_db', 'userdata', `${accountData.$id}`)
    .catch((error) => {
      return error
    })
}
