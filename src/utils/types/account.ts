import type { AppwriteException, Models } from 'node-appwrite'

export interface AccountType
  extends Models.User<Models.Preferences>,
    AppwriteException {}

/**
 * This data is returned from the API by calling their own account data.
 */
export interface UserAccountType extends AccountType {
  prefs: {
    nsfw: boolean
  }
}
