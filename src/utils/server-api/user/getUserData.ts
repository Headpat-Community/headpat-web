import { createSessionServerClient } from "@/app/appwrite-session"
import { getUser } from "@/utils/server-api/account/user"
import type {
  UserDataType,
  UserProfileDocumentsType,
} from "@/utils/types/models"
import { Query } from "node-appwrite"

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserDataFromProfileUrl(
  profileUrl: string
): Promise<UserDataType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .listRows({
      databaseId: "hp_db",
      tableId: "userdata",
      queries: [Query.equal("profileUrl", profileUrl)],
    })
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}

/**
 * This function is used to get the user data.
 * @example
 * const userData = await getUserData()
 */
export async function getUserData(): Promise<UserProfileDocumentsType> {
  const { databases } = await createSessionServerClient()
  const accountData = await getUser()
  if (!accountData?.$id) {
    return {} as UserProfileDocumentsType
  }
  return await databases
    .getRow({
      databaseId: "hp_db",
      tableId: "userdata",
      rowId: accountData.$id,
    })
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
