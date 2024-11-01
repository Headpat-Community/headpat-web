import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'edge'

export async function GET(request) {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')

  try {
    // Extract query parameters from the incoming request
    const queryParams = new URLSearchParams(
      request.url.split('?')[1]
    ).toString()

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564499f223ba3233ca/documents?${queryParams}`

    const response = await fetch(fetchURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    })

    if (!response.ok) {
      console.error(response)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500 })
  }
}
