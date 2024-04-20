'use server'
import { createSessionServerClient } from '@/app/appwrite-session'

export async function editSocials(
  discordName: string,
  telegramName: string,
  furaffinityName: string,
  X_name: string,
  twitchName: string
) {
  try {
    const { databases, account } = await createSessionServerClient()
    const userMe = await account.get()

    return await databases.updateDocument('hp_db', 'userdata', userMe?.$id, {
      discordname: discordName,
      telegramname: telegramName,
      furaffinityname: furaffinityName,
      X_name: X_name,
      twitchname: twitchName,
    })
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
