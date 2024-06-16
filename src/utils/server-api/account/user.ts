import { createSessionServerClient } from '@/app/appwrite-session'
import { UserAccountType } from '@/utils/types'

export async function getUser() {
  const { account } = await createSessionServerClient()
  const data: UserAccountType = await account.get().catch((error) => {
    return error
  })
  return data
}

export async function getMfaList() {
  const { account } = await createSessionServerClient()
  return await account.listMfaFactors().catch((error) => {
    return error
  })
}

export async function getTeams() {
  const { teams } = await createSessionServerClient()
  return await teams.list().catch((error) => {
    return error
  })
}
