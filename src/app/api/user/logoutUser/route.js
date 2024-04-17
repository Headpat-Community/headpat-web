import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionClient } from '../../../appwrite-session'

export const runtime = 'edge'

export async function POST(request) {
  const { account } = await createSessionClient(request)

  try {
    await account.deleteSession('current')

    // Delete the specified cookie
    cookies().delete(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`)

    return NextResponse.json({ status: 204 })
  } catch (error) {
    return NextResponse.json({ error: error.message, status: error.code })
  }
}
