import Client from "./page.client"
import { createSessionServerClient } from "@/app/appwrite-session"

export const metadata = {
  title: "Account Gallery",
}

export default async function FetchGallery() {
  const { account } = await createSessionServerClient()
  const userData = await account.get()

  const userId = userData?.$id
  const enableNsfw = userData?.prefs?.nsfw

  return <Client enableNsfw={enableNsfw || false} userId={userId} />
}
