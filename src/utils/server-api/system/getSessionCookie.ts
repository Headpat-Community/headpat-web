'use server'
import { headers } from 'next/headers'

/**
 * This function is used to get the cookies from the request headers.
 * It's also a weird way to check if the user is logged in.
 * @deprecated
 * @returns {string} The cookie string.
 * @example
 * const sessionCookie = await getSessionCookie()
 * console.log(sessionCookie)
 */
async function getSessionCookie() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const cookies = cookieHeader ? cookieHeader.split('; ') : []
  return cookies.find((cookie) => cookie.startsWith('a_session'))
}
