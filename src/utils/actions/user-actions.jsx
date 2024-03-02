'use server'
import { headers } from 'next/headers'

export async function getUsers () {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
      },
    },
  )

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.documents
}

export async function getUserSelf () {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    },
  )

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.documents[0]
}

export async function getUserData (query = '') {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents?${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    },
  )

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.documents
}

export async function getUserDataSelf () {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const accountData = await getAccount()
  const userId = accountData.$id
  const userUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents/${userId}`

  const getUserData = await fetch(userUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      'X-Appwrite-Response-Format': '1.4.0',
      Cookie: cookieHeader,
    },
    cache: 'no-cache',
  })

  if (!getUserData.ok) {
    return getUserData.status
  }

  return await getUserData.json()
}

export async function getUserDataById (userId) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    },
  )

  if (!response.ok) {
    return false
  }

  return await response.json()
}

export async function editUserData (userId, requestBody) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    })

  if (!response.ok) {
    return response.status
  }

  return await response.json()
}

export async function checkUserDataExists () {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents`
  const postURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents`
  const accountURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account`

  const response = await fetch(fetchURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      'X-Appwrite-Response-Format': '1.4.0',
      Cookie: cookieHeader,
    },
  })

  const data = await response.json()

  if (data.documents.length === 0) {
    const getAccountResponse = await fetch(accountURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    })

    const getAccountData = await getAccountResponse.json()

    const postResponse = await fetch(postURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        documentId: getAccountData.$id,
        data: {
          name: getAccountData.name,
          email: getAccountData.email,
        },
      }),
    })
  }

  if (!response.ok) {
    return response.status
  }

  return true
}

export async function getAccount () {
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
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return false
  }

  return await response.json()
}

export async function createJWT () {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Response-Format': '1.4.0',
        'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        Cookie: cookieHeader,
      },
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}

export async function loginUser () {
  return true
}

export async function sendEmailVerification () {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/verification`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/i/verify-email`,
      }),
    },
  )

  return response.ok
}

export async function emailVerification (requestBody) {
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
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return true
}

export async function forgotPassword (requestBody) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/recovery`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return false
  }

  return await response.json()
}

export async function resetPassword (requestBody) {
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
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}

export async function editUserPassword (requestBody) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/password`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return false
  }

  return await response.json()
}

export async function editUserEmail (requestBody) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account/email`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}

export async function createAccount (requestBody) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/account`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Response-Format': '1.4.0',
        'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}

export async function handleNsfwChange (userId, requestBody) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    // Return status code to the client
    return response.status
  }

  return await response.json()
}

export async function avatarChange (userId, formData) {
  // TODO: This does not work
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')

  // Read the entire stream and buffer it
  //const requestData = await request.arrayBuffer();

  // See if user has an avatar already
  const avatarResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents?queries[]=equal("userId","${userId}")`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    },
  )

  const avatarData = await avatarResponse.json()
  const avatarDocumentId = avatarData?.documents[0]?.$id
  const avatarGalleryId = avatarData?.documents[0]?.gallery_id
  // If user has an avatar, delete it

  if (avatarData.documents.length !== 0) {
    const deleteURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${avatarGalleryId}`

    const deleteResponse = await fetch(deleteURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    })

    const deleteData = await deleteResponse.json()
    console.log(deleteData)

    const deleteDocURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents/${avatarDocumentId}`

    const deleteDocResponse = await fetch(deleteDocURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
    })
  }

  const uploadImage = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: formData,
    },
  )

  const imageData = await uploadImage.json()
  console.log(imageData)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        documentId: 'unique()',
        data: {
          gallery_id: imageData.$id,
          sizeOriginal: imageData.sizeOriginal,
          userId: formData,
        },
      }),
    },
  )

  // PATCH the userdata with the new avatar id
  const patchResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        'X-Appwrite-Response-Format': '1.4.0',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        data: {
          avatarId: imageData.$id,
        },
      }),
    },
  )

  if (!response.ok) {
    const errorData = await response.text()
    console.log(errorData)
  }

  if (!patchResponse.ok) {
    const errorData = await patchResponse.text()
    throw new Error(`Failed to PATCH data: ${errorData}`)
  }

  return await response.json()
}