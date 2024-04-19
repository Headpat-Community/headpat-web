'use server'
import { createAdminClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'

export async function createUser(body: {
  email: string
  password: string
  username: string
}) {
  const { account } = await createAdminClient()

  try {
    const data = await account.create(
      ID.unique(),
      body.email,
      body.password,
      body.username
    )
    return data
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
