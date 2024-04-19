'use server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { account, databases } from '@/app/appwrite-client'
import { Models } from 'node-appwrite'

export async function changeEmail(email: string, password: string) {
  const { account } = await createSessionServerClient()

  try {
    return await account.updateEmail(email, password)
  } catch (error) {
    console.log(error)
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changePassword(
  newPassword: string,
  currentPassword: string
) {
  const { account } = await createSessionServerClient()

  try {
    return await account.updatePassword(newPassword, currentPassword)
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changePreferences(body: Models.Preferences) {
  const { account } = await createSessionServerClient()

  try {
    return await account.updatePrefs(body)
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changeProfileUrl(profileUrl: string) {
  const { account } = await createSessionServerClient()
  const userMe = await account.get()

  try {
    return await databases.updateDocument('hp_db', 'userdata', userMe?.$id, {
      profileUrl: profileUrl,
    })
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
