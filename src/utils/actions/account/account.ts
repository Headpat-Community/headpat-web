'use server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { AuthenticationFactor, ExecutionMethod, Models } from 'node-appwrite'
import { getMfaFactors } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export async function changeEmail(email: string, password: string) {
  try {
    const { account } = await createSessionServerClient()
    return await account.updateEmail(email, password)
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changePassword(
  newPassword: string,
  currentPassword: string
) {
  try {
    const { account } = await createSessionServerClient()
    return await account.updatePassword(newPassword, currentPassword)
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changePreferences(body: Models.Preferences) {
  try {
    const { account } = await createSessionServerClient()
    return await account.updatePrefs(body)
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function changeProfileUrl(profileUrl: string) {
  try {
    const { account, databases } = await createSessionServerClient()
    const userMe = await account.get()

    return await databases.updateDocument('hp_db', 'userdata', userMe?.$id, {
      profileUrl: profileUrl,
    })
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}

export async function startMfaChallenge() {
  const { account } = await createSessionServerClient()
  const factors = await getMfaFactors()
  if (factors.totp) {
    return await account.createMfaChallenge(AuthenticationFactor.Totp)
  } else {
    return
  }
}

export async function updateMfaChallenge(challengeId: string, otp: string) {
  const { account } = await createSessionServerClient()
  return await account.updateMfaChallenge(challengeId, otp).catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}

export async function deleteAccount() {
  try {
    console.log('deleteAccount 1')
    const { account, functions } = await createSessionServerClient()
    console.log('deleteAccount 2')
    await functions.createExecution(
      '65e2126d9e431eb3c473',
      '',
      true,
      'deleteAccount',
      ExecutionMethod.POST
    )
    console.log('deleteAccount 3')
    await account.deleteSessions()
    console.log('deleteAccount 4')
    return redirect('/')
  } catch (error) {
    console.log(error.status + ' ' + error.message)
    return JSON.parse(JSON.stringify(error))
  }
}
