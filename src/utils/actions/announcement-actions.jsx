'use server'
import { headers } from 'next/headers'

export async function getAnnouncements() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/hp_db/collections/announcements/documents`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.5.0',
        Cookie: cookieHeader,
      },
      next: {
        revalidate: 5,
      },
    }
  )

  try {
    return await response.json()
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return []
  }
}
