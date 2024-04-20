import { createSessionServerClient } from '@/app/appwrite-session'
import { headers } from 'next/headers'
import { Models } from 'node-appwrite'

/**
 * This function is used to get the cookies from the request headers.
 * It's also a weird way to check if the user is logged in.
 * @deprecated
 * @returns {string} The cookie string.
 * @example
 * const sessionCookie = await getCookies()
 * console.log(sessionCookie)
 */
async function getCookies() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const cookies = cookieHeader ? cookieHeader.split('; ') : []
  return cookies.find((cookie) => cookie.startsWith('a_session'))
}

/**
 * This function is used to get the logged in user.
 * @returns {Promise<Models.User<Models.Preferences> | null>} The logged in user.
 * @example
 * const accountData = await getLoggedInUser()
 */
export async function getLoggedInUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const { account } = await createSessionServerClient()
    return await account.get()
  } catch (error) {
    return null
  }
}
