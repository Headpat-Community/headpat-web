import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

export const runtime = 'edge'

export async function POST(request) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  try {
    // Get the raw body data as ArrayBuffer
    const requestData = await request.arrayBuffer()

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/badges/files`

    const uploadImage = await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type':
          request.headers.get('Content-Type') || 'multipart/form-data',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: requestData,
    })

    if (!uploadImage.ok) {
      console.log(uploadImage)
      throw new Error('Failed to update data')
    }

    const data = await uploadImage.json()
    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 })
  }
}
