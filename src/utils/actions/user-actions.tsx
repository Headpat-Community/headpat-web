'use server'
import { headers } from 'next/headers'

export async function emailVerification(requestBody: any) {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/verification`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return true
}

export async function resetPassword(requestBody: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/recovery`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}
