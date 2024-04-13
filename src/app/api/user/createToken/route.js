import { cookies } from 'next/headers'
import { createAdminClient } from '../../../appwrite-session'

export const runtime = 'edge'

export async function POST(request) {
  const { userId } = await request.json()
  const { users } = await createAdminClient()

  const result = await users.createToken(
    userId, // userId
    128 // token length
  )

  cookies().set(`jwt_temp`, result.secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: new Date(result.expire),
    path: '/',
  })

  try {
    return Response.json({ status: 200 })
  } catch (error) {
    return Response.json(error, { status: 401 })
  }
}
