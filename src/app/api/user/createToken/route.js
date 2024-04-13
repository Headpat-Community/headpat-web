import sdk from 'node-appwrite'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export async function POST(request) {
  const { userId } = await request.json()

  const client = new sdk.Client()
    .setEndpoint(`${process.env.NEXT_PUBLIC_API_URL}/v1`) // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_API_KEY) // Your secret API key

  const users = new sdk.Users(client)

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
