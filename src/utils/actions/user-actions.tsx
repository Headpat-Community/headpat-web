'use server'
import { headers } from 'next/headers'

export async function getUsers() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/hp_db/collections/userdata/documents`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
      },
      next: {
        revalidate: 60,
      },
    }
  )

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.documents
}

export async function getUserSelf() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/hp_db/collections/userdata/documents/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    }
  )

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.documents[0]
}

export async function getUserData(query = '') {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/hp_db/collections/userdata/documents?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    }
  )

  if (!response.ok) {
    return response.status + ' ' + response.statusText
  }

  const data = await response.json()
  return data.documents
}

export async function getUserDataSelf() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const accountData = await getAccount()
  const userId = accountData.$id
  const userUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/hp_db/collections/userdata/documents/${userId}`

  const getUserData = await fetch(userUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      'X-Appwrite-Response-Format': '1.4.0',
      Cookie: cookieHeader,
    },
  })

  if (!getUserData.ok) {
    return getUserData.status + ' ' + getUserData.statusText
  }

  return await getUserData.json()
}

export async function getAccount() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      next: {
        tags: ['accountRefresh'],
      },
    }
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status + ' ' + response.statusText
  }

  return await response.json()
}

export async function emailVerification(requestBody: any) {
  const headersList = headers()
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
